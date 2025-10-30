import bpy
import os

# Clear existing scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Output directory
output_dir = "/home/michael/RustroverProjects/BackersLittleHelper/src/assets/models"
os.makedirs(output_dir, exist_ok=True)

print("Creating coin model...")

# Create cylinder for coin shape
bpy.ops.mesh.primitive_cylinder_add(
    vertices=64,  # High vertex count for smooth edges
    radius=1,
    depth=0.1,  # Thin like a coin
    location=(0, 0, 0)
)
coin = bpy.context.active_object
coin.name = "Coin"

# Add bevel modifier for rounded edges
bevel_mod = coin.modifiers.new(name="Bevel", type='BEVEL')
bevel_mod.width = 0.01
bevel_mod.segments = 4

# Apply modifier
bpy.ops.object.modifier_apply(modifier=bevel_mod.name)

# Recalculate normals
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode='OBJECT')

# Create material with metallic properties and logo texture
mat = bpy.data.materials.new(name="CoinMaterial")
mat.use_nodes = True
nodes = mat.node_tree.nodes
nodes.clear()

# Create shader nodes
node_principled = nodes.new(type='ShaderNodeBsdfPrincipled')
node_output = nodes.new(type='ShaderNodeOutputMaterial')
node_tex_coord = nodes.new(type='ShaderNodeTexCoord')
node_mapping = nodes.new(type='ShaderNodeMapping')
node_logo = nodes.new(type='ShaderNodeTexImage')
node_mix = nodes.new(type='ShaderNodeMixRGB')

# Load logo texture
logo_path = "/home/michael/RustroverProjects/BackersLittleHelper/src/assets/img/MadeByTheCommunity_Black.png"
if os.path.exists(logo_path):
    node_logo.image = bpy.data.images.load(logo_path)
    print(f"Loaded logo texture: {logo_path}")
else:
    print(f"Warning: Logo texture not found at {logo_path}")

# Set metallic material properties
node_principled.inputs['Metallic'].default_value = 0.95
node_principled.inputs['Roughness'].default_value = 0.1
node_principled.inputs['Base Color'].default_value = (0.8, 0.85, 0.9, 1.0)  # Silver color

# Mix logo with base metallic color
node_mix.blend_type = 'MULTIPLY'
node_mix.inputs['Fac'].default_value = 0.5

# Position nodes for clarity
node_tex_coord.location = (-800, 0)
node_mapping.location = (-600, 0)
node_logo.location = (-400, 0)
node_mix.location = (-200, 0)
node_principled.location = (0, 0)
node_output.location = (300, 0)

# Connect nodes
links = mat.node_tree.links
links.new(node_tex_coord.outputs['UV'], node_mapping.inputs['Vector'])
links.new(node_mapping.outputs['Vector'], node_logo.inputs['Vector'])
links.new(node_logo.outputs['Color'], node_mix.inputs['Color1'])
links.new(node_mix.outputs['Color'], node_principled.inputs['Base Color'])
links.new(node_principled.outputs['BSDF'], node_output.inputs['Surface'])

# Assign material to coin
if coin.data.materials:
    coin.data.materials[0] = mat
else:
    coin.data.materials.append(mat)

# UV unwrap the coin for proper texture mapping
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=66.0, island_margin=0.02)
bpy.ops.object.mode_set(mode='OBJECT')

# Export as OBJ
bpy.ops.object.select_all(action='DESELECT')
coin.select_set(True)

output_path = os.path.join(output_dir, "coin.obj")
bpy.ops.wm.obj_export(
    filepath=output_path,
    export_selected_objects=True,
    export_materials=True
)

print(f"Exported coin model: {output_path}")

# Also export material info
mtl_path = os.path.join(output_dir, "coin.mtl")
if os.path.exists(mtl_path):
    print(f"Material file created: {mtl_path}")

print("Coin creation complete!")
