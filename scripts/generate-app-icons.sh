#!/bin/bash

# Source icon path
SOURCE_ICON="src/assets/app_icon.png"

# Android icons
echo "Generating Android icons..."
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

# Check if sips command exists (macOS)
if command -v sips >/dev/null 2>&1; then
    # Generate Android foreground icons using sips
    # Making foreground icons slightly smaller (75% of the total size) to fit in the circular area
    sips -z 36 36 "$SOURCE_ICON" --out "android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png"
    sips -z 54 54 "$SOURCE_ICON" --out "android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png"
    sips -z 72 72 "$SOURCE_ICON" --out "android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png"
    sips -z 108 108 "$SOURCE_ICON" --out "android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png"
    sips -z 144 144 "$SOURCE_ICON" --out "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png"

    # Legacy icons for older Android versions
    sips -z 48 48 "$SOURCE_ICON" --out "android/app/src/main/res/mipmap-mdpi/ic_launcher.png"
    sips -z 72 72 "$SOURCE_ICON" --out "android/app/src/main/res/mipmap-hdpi/ic_launcher.png"
    sips -z 96 96 "$SOURCE_ICON" --out "android/app/src/main/res/mipmap-xhdpi/ic_launcher.png"
    sips -z 144 144 "$SOURCE_ICON" --out "android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png"
    sips -z 192 192 "$SOURCE_ICON" --out "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"

    # Copy the same icons for round icons (legacy support)
    cp "android/app/src/main/res/mipmap-mdpi/ic_launcher.png" "android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png"
    cp "android/app/src/main/res/mipmap-hdpi/ic_launcher.png" "android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png"
    cp "android/app/src/main/res/mipmap-xhdpi/ic_launcher.png" "android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png"
    cp "android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png" "android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png"
    cp "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png" "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png"

    echo "Android icons generated successfully!"
else
    echo "Error: sips command not found. Please install ImageMagick or use another image processing tool."
    exit 1
fi

# iOS icons
echo "Generating iOS icons..."
mkdir -p ios/toutixApp/Images.xcassets/AppIcon.appiconset

# iOS icon sizes
declare -a sizes=(
    "20x20"
    "29x29"
    "40x40"
    "60x60"
    "76x76"
    "83.5x83.5"
    "1024x1024"
)

# Generate iOS icons
for size in "${sizes[@]}"; do
    width=${size%x*}
    height=${size#*x}
    
    # Generate @1x
    sips -z ${width%.*} ${height%.*} "$SOURCE_ICON" --out "ios/toutixApp/Images.xcassets/AppIcon.appiconset/icon_${size}.png"
    
    # Generate @2x
    if [ "$size" != "1024x1024" ]; then
        sips -z $((${width%.*}*2)) $((${height%.*}*2)) "$SOURCE_ICON" --out "ios/toutixApp/Images.xcassets/AppIcon.appiconset/icon_${size}@2x.png"
    fi
    
    # Generate @3x for specific sizes
    if [ "$size" = "20x20" ] || [ "$size" = "29x29" ] || [ "$size" = "40x40" ] || [ "$size" = "60x60" ]; then
        sips -z $((${width%.*}*3)) $((${height%.*}*3)) "$SOURCE_ICON" --out "ios/toutixApp/Images.xcassets/AppIcon.appiconset/icon_${size}@3x.png"
    fi
done

echo "iOS icons generated successfully!" 