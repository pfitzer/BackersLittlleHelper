import bpy
import random
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

    # Create base icosphere
    subdivisions = random.randint(2, 3)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=1, location=(0, 0, 0))
    asteroid = bpy.context.active_object
    asteroid.name = f"Asteroid_{i}"

    # Apply non-uniform scale
    asteroid.scale = (
        0.7 + random.random() * 0.6,
        0.7 + random.random() * 0.6,
        0.7 + random.random() * 0.6
    )
    bpy.ops.object.transform_apply(scale=True)

    # Enter edit mode and displace vertices randomly
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')

    # Go back to object mode
    bpy.ops.object.mode_set(mode='OBJECT')

    # Manually displace vertices for rocky look
    mesh = asteroid.data
    for vert in mesh.vertices:
        displacement_strength = random.uniform(0.05, 0.15)
        displacement = (random.random() - 0.5) * displacement_strength
        vert.co = vert.co * (1.0 + displacement)

    # Recalculate normals
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')

    # Export as OBJ (more reliable)
    bpy.ops.object.select_all(action='DESELECT')
    asteroid.select_set(True)

    output_path = os.path.join(output_dir, f"asteroid_{i}.obj")
    bpy.ops.wm.obj_export(
        filepath=output_path,
        export_selected_objects=True,
        export_materials=False
    )

    print(f"Exported: {output_path}")

    # Delete asteroid for next iteration
    bpy.ops.object.delete()

print(f"Successfully generated {num_asteroids} asteroid models!")
