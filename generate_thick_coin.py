#!/usr/bin/env python3
"""
Generate thicker coin cylinder for better visibility.
"""

import bpy
import os

OUTPUT_PATH = "src/assets/models/coin_thick.obj"
COIN_DIAMETER = 2.0
COIN_THICKNESS = 0.15  # Moderate thickness like real coin
SEGMENTS = 64

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for mat in bpy.data.materials:
        bpy.data.materials.remove(mat)

def create_thick_coin():
    bpy.ops.mesh.primitive_cylinder_add(
        radius=COIN_DIAMETER / 2,
        depth=COIN_THICKNESS,
        vertices=SEGMENTS,
        location=(0, 0, 0)
    )
    coin = bpy.context.active_object
    coin.name = "CoinThick"

    # Smooth shading
    bpy.ops.object.shade_smooth()

    return coin

def create_material():
    mat = bpy.data.materials.new(name="CoinMaterial")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()

    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.8, 0.85, 0.9, 1.0)
    bsdf.inputs['Metallic'].default_value = 0.9
    bsdf.inputs['Roughness'].default_value = 0.2

    output = nodes.new(type='ShaderNodeOutputMaterial')
    output.location = (300, 0)

    mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def export_obj(coin):
    bpy.ops.object.select_all(action='DESELECT')
    coin.select_set(True)
    bpy.context.view_layer.objects.active = coin

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    bpy.ops.wm.obj_export(
        filepath=OUTPUT_PATH,
        export_selected_objects=True,
        export_materials=True,
        export_normals=True,
        path_mode='RELATIVE'
    )

def main():
    print("=" * 70)
    print("THICK COIN GENERATOR")
    print("=" * 70)

    clear_scene()
    coin = create_thick_coin()
    print(f"✓ Created thick coin: Ø{COIN_DIAMETER} × {COIN_THICKNESS}")

    mat = create_material()
    coin.data.materials.append(mat)

    export_obj(coin)

    size = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"✓ Exported: {OUTPUT_PATH} ({size:.1f} KB)")
    print("=" * 70)

if __name__ == "__main__":
    main()
