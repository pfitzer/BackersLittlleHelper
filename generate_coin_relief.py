import bpy
import os

# Clear existing scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Output directory
output_dir = "/home/michael/RustroverProjects/BackersLittleHelper/src/assets/models"
os.makedirs(output_dir, exist_ok=True)

print("Creating 3D relief coin from logo image...")

# Load the logo image
logo_path = "/home/michael/RustroverProjects/BackersLittleHelper/src/assets/img/MadeByTheCommunity_Black.png"
if not os.path.exists(logo_path):
    print(f"Error: Logo image not found at {logo_path}")
    exit(1)

logo_image = bpy.data.images.load(logo_path)
print(f"Loaded logo: {logo_path}")

# Create a plane with high subdivision for displacement
bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, 0))
coin = bpy.context.active_object
coin.name = "CoinRelief"

# Subdivide the plane heavily for smooth displacement
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
# Subdivide multiple times for high detail
for i in range(7):  # 7 subdivisions = 2^7 = 128x128 segments
    bpy.ops.mesh.subdivide()
bpy.ops.object.mode_set(mode='OBJECT')

print(f"Subdivided plane: {len(coin.data.vertices)} vertices")

# Create displacement texture from logo image
disp_tex = bpy.data.textures.new("DisplacementTexture", type='IMAGE')
disp_tex.image = logo_image

# Add displacement modifier
disp_mod = coin.modifiers.new(name="Displace", type='DISPLACE')
disp_mod.texture = disp_tex
disp_mod.strength = 0.15  # Height of the relief
disp_mod.mid_level = 0.0  # Black becomes low, white becomes high
disp_mod.texture_coords = 'UV'

# Apply the displacement modifier
bpy.ops.object.modifier_apply(modifier=disp_mod.name)

# Remove faces that are at or below zero (the black areas)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.object.mode_set(mode='OBJECT')

# Select vertices below threshold and delete them
threshold = 0.01
vertices_to_delete = []
for vert in coin.data.vertices:
    if vert.co.z < threshold:
        vert.select = True
    else:
        vert.select = False

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.delete(type='VERT')

# Clean up loose geometry
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.delete_loose()
bpy.ops.mesh.normals_make_consistent(inside=False)

# Add solidify modifier to give thickness
bpy.ops.object.mode_set(mode='OBJECT')
solidify_mod = coin.modifiers.new(name="Solidify", type='SOLIDIFY')
solidify_mod.thickness = 0.05
solidify_mod.offset = 0

# Apply solidify
bpy.ops.object.modifier_apply(modifier=solidify_mod.name)

# Smooth shading
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.shade_smooth()

print("Applied displacement and created 3D relief")

# Create gold metallic material
mat = bpy.data.materials.new(name="GoldMaterial")
mat.use_nodes = True
nodes = mat.node_tree.nodes
nodes.clear()

# Create shader nodes for gold metal
node_principled = nodes.new(type='ShaderNodeBsdfPrincipled')
node_output = nodes.new(type='ShaderNodeOutputMaterial')

# Gold color and properties
node_principled.inputs['Base Color'].default_value = (0.831, 0.686, 0.216, 1.0)  # Gold
node_principled.inputs['Metallic'].default_value = 1.0
node_principled.inputs['Roughness'].default_value = 0.15

# Connect nodes
links = mat.node_tree.links
links.new(node_principled.outputs['BSDF'], node_output.inputs['Surface'])

# Assign material
if coin.data.materials:
    coin.data.materials[0] = mat
else:
    coin.data.materials.append(mat)

# Export as OBJ
bpy.ops.object.select_all(action='DESELECT')
coin.select_set(True)

output_path = os.path.join(output_dir, "coin_relief.obj")
bpy.ops.wm.obj_export(
    filepath=output_path,
    export_selected_objects=True,
    export_materials=True
)

print(f"Exported 3D relief coin: {output_path}")
print("Coin relief creation complete!")
