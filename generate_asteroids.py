import bpy
import random
import math
import os

# Clear existing scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Output directory
output_dir = "/home/michael/RustroverProjects/BackersLittleHelper/src/assets/models"
os.makedirs(output_dir, exist_ok=True)

# Number of asteroid variations to generate
num_asteroids = 8

for i in range(num_asteroids):
    print(f"Generating asteroid {i+1}/{num_asteroids}...")

    # Create base icosphere with random subdivision
    subdivisions = random.randint(2, 3)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=1, location=(0, 0, 0))
    asteroid = bpy.context.active_object
    asteroid.name = f"Asteroid_{i}"

    # Apply non-uniform scale for irregular shape
    asteroid.scale = (
        0.8 + random.random() * 0.4,
        0.7 + random.random() * 0.6,
        0.8 + random.random() * 0.4
    )
    bpy.ops.object.transform_apply(scale=True)

    # Add Displace modifier for rocky surface
    displace_mod = asteroid.modifiers.new(name="Displace", type='DISPLACE')

    # Create texture for displacement
    tex = bpy.data.textures.new(f"AsteroidDisplace_{i}", type='VORONOI')
    tex.noise_scale = random.uniform(2.0, 4.0)
    displace_mod.texture = tex
    displace_mod.strength = random.uniform(0.1, 0.25)
    displace_mod.texture_coords = 'OBJECT'

    # Add second displacement for more detail
    displace_mod2 = asteroid.modifiers.new(name="Displace2", type='DISPLACE')
    tex2 = bpy.data.textures.new(f"AsteroidDisplace2_{i}", type='CLOUDS')
    tex2.noise_scale = random.uniform(1.0, 2.5)
    displace_mod2.texture = tex2
    displace_mod2.strength = random.uniform(0.05, 0.15)
    displace_mod2.texture_coords = 'OBJECT'

    # Apply modifiers
    bpy.ops.object.modifier_apply(modifier=displace_mod.name)
    bpy.ops.object.modifier_apply(modifier=displace_mod2.name)

    # Add subdivision surface for smoother look (optional, low level)
    if random.random() > 0.5:
        subsurf = asteroid.modifiers.new(name="Subdivision", type='SUBSURF')
        subsurf.levels = 1
        subsurf.render_levels = 1
        bpy.ops.object.modifier_apply(modifier=subsurf.name)

    # Recalculate normals
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')

    # Create material with Ceres texture
    mat = bpy.data.materials.new(name=f"AsteroidMat_{i}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()

    # Add nodes for PBR material
    node_principled = nodes.new(type='ShaderNodeBsdfPrincipled')
    node_output = nodes.new(type='ShaderNodeOutputMaterial')
    node_tex = nodes.new(type='ShaderNodeTexImage')

    # Load Ceres texture
    texture_path = "/home/michael/RustroverProjects/BackersLittleHelper/src/assets/textures/2k_ceres_fictional.jpg"
    if os.path.exists(texture_path):
        node_tex.image = bpy.data.images.load(texture_path)

    # Set material properties
    node_principled.inputs['Roughness'].default_value = random.uniform(0.9, 1.0)
    node_principled.inputs['Metallic'].default_value = random.uniform(0.0, 0.1)

    # Connect nodes
    links = mat.node_tree.links
    links.new(node_tex.outputs['Color'], node_principled.inputs['Base Color'])
    links.new(node_principled.outputs['BSDF'], node_output.inputs['Surface'])

    # Assign material
    if asteroid.data.materials:
        asteroid.data.materials[0] = mat
    else:
        asteroid.data.materials.append(mat)

    # Select only the asteroid
    bpy.ops.object.select_all(action='DESELECT')
    asteroid.select_set(True)
    bpy.context.view_layer.objects.active = asteroid

    # Export as GLB
    output_path = os.path.join(output_dir, f"asteroid_{i}.glb")
    try:
        bpy.ops.export_scene.gltf(
            filepath=output_path,
            export_format='GLB',
            use_selection=True
        )
        print(f"Exported: {output_path}")
    except Exception as e:
        print(f"Export failed: {e}")
        # Try OBJ export as fallback
        output_path_obj = os.path.join(output_dir, f"asteroid_{i}.obj")
        bpy.ops.wm.obj_export(
            filepath=output_path_obj,
            export_selected_objects=True
        )
        print(f"Exported as OBJ: {output_path_obj}")

    print(f"Exported: {output_path}")

    # Delete asteroid for next iteration
    bpy.ops.object.delete()

print(f"Successfully generated {num_asteroids} asteroid models!")
