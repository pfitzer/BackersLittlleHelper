import bpy
import os

# Clear existing scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Output directory
output_dir = "/home/michael/RustroverProjects/BackersLittleHelper/src/assets/models"
os.makedirs(output_dir, exist_ok=True)

print("Creating extruded coin badge from logo...")

# Load the logo image
logo_path = "/home/michael/RustroverProjects/BackersLittleHelper/src/assets/img/MadeByTheCommunity_Black.png"
if not os.path.exists(logo_path):
    print(f"Error: Logo image not found at {logo_path}")
    exit(1)

logo_image = bpy.data.images.load(logo_path)
print(f"Loaded logo: {logo_path}")

# Create base disc for the coin
bpy.ops.mesh.primitive_cylinder_add(
    radius=1,
    depth=0.15,  # Thicker coin base
    vertices=64,
    location=(0, 0, 0)
)
coin_base = bpy.context.active_object
coin_base.name = "CoinBase"

# Create the logo relief on top
bpy.ops.mesh.primitive_plane_add(size=1.8, location=(0, 0, 0.075))
logo_relief = bpy.context.active_object
logo_relief.name = "LogoRelief"

# Subdivide the plane for displacement
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
for i in range(6):  # 6 subdivisions
    bpy.ops.mesh.subdivide()
bpy.ops.object.mode_set(mode='OBJECT')

print(f"Created logo plane with {len(logo_relief.data.vertices)} vertices")

# Create displacement texture
disp_tex = bpy.data.textures.new("LogoDisplace", type='IMAGE')
disp_tex.image = logo_image

# Add displacement modifier
disp_mod = logo_relief.modifiers.new(name="Displace", type='DISPLACE')
disp_mod.texture = disp_tex
disp_mod.strength = 0.1  # Relief height
disp_mod.mid_level = 0.5
disp_mod.texture_coords = 'UV'

# Apply displacement
bpy.ops.object.modifier_apply(modifier=disp_mod.name)

# Remove vertices below threshold (black areas)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

threshold = 0.08
for vert in logo_relief.data.vertices:
    if vert.co.z < threshold:
        vert.select = True

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.delete(type='VERT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.delete_loose()

# Smooth the relief
bpy.ops.mesh.vertices_smooth(factor=0.3, repeat=2)
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode='OBJECT')

# Add slight solidify to relief for more depth
solidify_mod = logo_relief.modifiers.new(name="Solidify", type='SOLIDIFY')
solidify_mod.thickness = 0.03
solidify_mod.offset = 1

# Apply and smooth
bpy.ops.object.modifier_apply(modifier=solidify_mod.name)
bpy.ops.object.shade_smooth()

# Join the coin base and relief
bpy.ops.object.select_all(action='DESELECT')
coin_base.select_set(True)
logo_relief.select_set(True)
bpy.context.view_layer.objects.active = coin_base
bpy.ops.object.join()

coin = bpy.context.active_object
coin.name = "CoinExtruded"

# Final smooth shading
bpy.ops.object.shade_smooth()

print("Created extruded coin with relief")

# Create gold material
mat = bpy.data.materials.new(name="CoinGold")
mat.use_nodes = True
nodes = mat.node_tree.nodes
nodes.clear()

# Shader nodes
node_principled = nodes.new(type='ShaderNodeBsdfPrincipled')
node_output = nodes.new(type='ShaderNodeOutputMaterial')

# Gold properties
node_principled.inputs['Base Color'].default_value = (0.831, 0.686, 0.216, 1.0)
node_principled.inputs['Metallic'].default_value = 1.0
node_principled.inputs['Roughness'].default_value = 0.15

# Connect
links = mat.node_tree.links
links.new(node_principled.outputs['BSDF'], node_output.inputs['Surface'])

# Assign material
if coin.data.materials:
    coin.data.materials[0] = mat
else:
    coin.data.materials.append(mat)

# Export
bpy.ops.object.select_all(action='DESELECT')
coin.select_set(True)

output_path = os.path.join(output_dir, "coin_extruded.obj")
bpy.ops.wm.obj_export(
    filepath=output_path,
    export_selected_objects=True,
    export_materials=True
)

print(f"Exported extruded coin: {output_path}")
print("Coin creation complete!")
