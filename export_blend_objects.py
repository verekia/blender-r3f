#!/usr/bin/env python3
"""
Blender script to export all objects from a .blend file as individual .glb files.
Usage: blender --background --python export_blend_objects.py -- <blend_file_path>
"""

import bpy
import sys
import os
from pathlib import Path

def clear_scene():
    """Clear the current scene of all objects."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def export_objects_from_blend(blend_file_path: str):
    """
    Export all objects from a .blend file as individual .glb files.
    
    Args:
        blend_file_path: Path to the .blend file to process
    """
    try:
        # Get the directory containing this script (project root)
        script_dir = Path(__file__).parent
        public_dir = script_dir / "public"
        
        # Ensure public directory exists
        public_dir.mkdir(exist_ok=True)
        
        # Clear current scene
        clear_scene()
        
        # Open the blend file
        print(f"Opening blend file: {blend_file_path}")
        bpy.ops.wm.open_mainfile(filepath=blend_file_path)
        
        # Get all mesh objects in the scene
        mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
        
        if not mesh_objects:
            print("No mesh objects found in the blend file")
            return
        
        print(f"Found {len(mesh_objects)} mesh objects")
        
        # Export each object individually
        for obj in mesh_objects:
            # Clear selection
            bpy.ops.object.select_all(action='DESELECT')
            
            # Select only this object
            obj.select_set(True)
            bpy.context.view_layer.objects.active = obj
            
            # Create output filename
            output_path = public_dir / f"{obj.name}.glb"
            
            print(f"Exporting object '{obj.name}' to {output_path}")
            
            # Export as GLB with only selected objects
            bpy.ops.export_scene.gltf(
                filepath=str(output_path),
                use_selection=True,
                export_format='GLB',
                export_materials='EXPORT',
                export_image_format='AUTO',
                export_cameras=False,
                export_lights=False
            )
            
            print(f"✅ Successfully exported '{obj.name}' as {output_path.name}")
            
    except Exception as e:
        print(f"❌ Error exporting objects: {e}")
        sys.exit(1)

def main():
    """Main entry point."""
    # Get command line arguments
    argv = sys.argv
    
    # Find the -- separator that Blender uses
    try:
        index = argv.index("--")
        script_args = argv[index + 1:]
    except ValueError:
        print("❌ Usage: blender --background --python export_blend_objects.py -- <blend_file_path>")
        sys.exit(1)
    
    if len(script_args) != 1:
        print("❌ Usage: blender --background --python export_blend_objects.py -- <blend_file_path>")
        sys.exit(1)
    
    blend_file_path = script_args[0]
    
    # Check if the blend file exists
    if not os.path.exists(blend_file_path):
        print(f"❌ Blend file not found: {blend_file_path}")
        sys.exit(1)
    
    print(f"🎨 Starting Blender GLB export for: {blend_file_path}")
    export_objects_from_blend(blend_file_path)
    print("🎉 Export completed successfully!")

if __name__ == "__main__":
    main()
