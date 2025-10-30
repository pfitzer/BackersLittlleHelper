import bpy
import os

# Clear existing scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Output directory
output_dir = "/home/michael/RustroverProjects/BackersLittleHelper/src/assets/models"
os.makedirs(output_dir, exist_ok=True)

print("Creating clean extruded coin from logo image...")

# Load the logo image
logo_path = "/home/michael/RustroverProjects/BackersLittleHelper/src/assets/img/MadeByTheCommunity_Black.png"
if not os.path.exists(logo_path):
    print(f"Error: Logo image not found at {logo_path}")
    exit(1)

logo_image = bpy.data.images.load(logo_path)
print(f"Loaded logo: {logo_path}")

# Create a plane
bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, 0))
coin = bpy.context.active_object
coin.name = "CoinClean"

# Subdivide the plane for detail
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
# More moderate subdivision
for i in range(6):  # 6 subdivisions
    bpy.ops.mesh.subdivide()
bpy.ops.object.mode_set(mode='OBJECT')

print(f"Subdivided plane: {len(coin.data.vertices)} vertices")

# Create displacement texture from logo
disp_tex = bpy.data.textures.new("CleanDisplacement", type='IMAGE')
disp_tex.image = logo_image
disp_tex.use_color_ramp = True  # Use color ramp for cleaner threshold

# Add displacement modifier with cleaner settings
disp_mod = coin.modifiers.new(name="Displace", type='DISPLACE')
disp_mod.texture = disp_tex
disp_mod.strength = 0.08  # Much smaller displacement for cleaner look
disp_mod.mid_level = 0.5  # Middle point
disp_mod.texture_coords = 'UV'

# Apply the displacement
bpy.ops.object.modifier_apply(modifier=disp_mod.name)

# Add smooth shading before cleanup
bpy.ops.object.shade_smooth()

# Remove vertices below threshold more carefully
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

# More aggressive threshold to remove black areas
threshold = 0.035
for vert in coin.data.vertices:
    if vert.co.z < threshold:
        vert.select = True

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.delete(type='VERT')

# Clean up
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.delete_loose()

# Smooth out any remaining artifacts
bpy.ops.mesh.vertices_smooth(factor=0.5, repeat=3)

# Recalculate normals
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode='OBJECT')

# Add moderate solidify for thickness
solidify_mod = coin.modifiers.new(name="Solidify", type='SOLIDIFY')
solidify_mod.thickness = 0.04
solidify_mod.offset = 0

# Apply solidify
bpy.ops.object.modifier_apply(modifier=solidify_mod.name)

# Add smooth modifier to clean up the surface
smooth_mod = coin.modifiers.new(name="Smooth", type='SMOOTH')
smooth_mod.iterations = 5
smooth_mod.factor = 0.5

# Apply smooth modifier
bpy.ops.object.modifier_apply(modifier=smooth_mod.name)

# Final smooth shading
bpy.ops.object.shade_smooth()

print("Created clean coin relief")

# Create gold metallic material
mat = bpy.data.materials.new(name="CleanGold")
mat.use_nodes = True
nodes = mat.node_tree.nodes
nodes.clear()

# Create shader nodes
node_principled = nodes.new(type='ShaderNodeBsdfPrincipled')
node_output = nodes.new(type='ShaderNodeOutputMaterial')

# Gold color
node_principled.inputs['Base Color'].default_value = (0.831, 0.686, 0.216, 1.0)
node_principled.inputs['Metallic'].default_value = 1.0
node_principled.inputs['Roughness'].default_value = 0.2

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

output_path = os.path.join(output_dir, "coin_clean.obj")
bpy.ops.wm.obj_export(
    filepath=output_path,
    export_selected_objects=True,
    export_materials=True
)

print(f"Exported clean coin: {output_path}")
print("Clean coin complete!")
