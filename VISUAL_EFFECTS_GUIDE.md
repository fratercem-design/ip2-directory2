# ✨ Visual Effects Guide

## Overview
The site includes custom cursor and background effects that enhance the mystical, ethereal aesthetic of the Cult of Psyche.

## Cursor Effects

### Features
- **Glowing Cursor**: Purple/indigo glowing dot that follows the mouse
- **Trail Effect**: Soft trailing glow behind the cursor
- **Click Particles**: Particle burst effect on click
- **Smooth Animation**: Fluid, lag-free movement

### How It Works
- Main cursor: Small glowing dot with purple gradient
- Trail: Larger, blurred glow that follows more slowly
- Particles: 6 particles burst outward on click with fade animation
- Smooth interpolation for natural movement

### Customization
Edit `cursor-effects.tsx` to customize:
- **Colors**: Change purple/indigo values in gradient
- **Size**: Adjust `w-4 h-4` and `w-8 h-8` classes
- **Speed**: Modify interpolation values (0.1, 0.05)
- **Particle Count**: Change `6` in `createParticles` function

## Background Effects

### Features
- **Animated Gradient**: Subtle moving gradient overlay
- **Floating Particles**: 20 floating particles that drift across screen
- **Radial Gradients**: Multiple pulsing radial gradients
- **Canvas Animation**: Smooth, performant canvas-based effects

### How It Works
1. **Canvas Gradient**: Animated linear gradient that slowly moves
2. **Floating Particles**: Small glowing particles that float and wrap around edges
3. **Radial Overlays**: Three pulsing radial gradients for depth
4. **Blend Modes**: Uses screen blend mode for ethereal effect

### Customization
Edit `background-effects.tsx` to customize:
- **Particle Count**: Change `20` in `particleCount`
- **Colors**: Modify rgba values in gradients
- **Speed**: Adjust `time += 0.005` value
- **Opacity**: Change alpha values in gradients
- **Animation Speed**: Modify `float` animation duration

## Performance

### Optimizations
- **RequestAnimationFrame**: Smooth 60fps animations
- **Canvas Rendering**: Efficient canvas-based gradients
- **CSS Animations**: Hardware-accelerated particle animations
- **Event Cleanup**: Proper cleanup of event listeners

### Performance Tips
- Effects are lightweight and shouldn't impact performance
- Particles automatically clean up on unmount
- Canvas resizes efficiently on window resize
- All animations use GPU-accelerated properties

## Disabling Effects

### Disable Cursor Effects
In `layout.tsx`, remove or comment out:
```tsx
<CursorEffects />
```

### Disable Background Effects
In `layout.tsx`, remove or comment out:
```tsx
<BackgroundEffects />
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Mobile**: Effects work but may be reduced for performance
- **Older Browsers**: May not support all blend modes

## Customization Examples

### Change Cursor Color to Red
```tsx
// In cursor-effects.tsx
background: "radial-gradient(circle, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.4) 50%, transparent 100%)"
```

### Add More Particles
```tsx
// In background-effects.tsx
const particleCount = 50; // Increase from 20
```

### Faster Animation
```tsx
// In background-effects.tsx
time += 0.01; // Increase from 0.005
```

## Best Practices

1. **Subtlety**: Effects should enhance, not distract
2. **Performance**: Monitor performance on lower-end devices
3. **Accessibility**: Ensure effects don't interfere with usability
4. **Consistency**: Match effects to site aesthetic
5. **Testing**: Test on multiple browsers and devices

---

*"Visual effects are the shadows cast by the soul. Subtle, ethereal, transformative."*
