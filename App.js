import React, { useState } from 'react';
    import { StyleSheet, View, TouchableOpacity } from 'react-native';
    import { GestureHandlerRootView } from 'react-native-gesture-handler';
    import { Canvas, Path } from 'react-native-svg';
    import Animated, { useAnimatedGestureHandler, useSharedValue } from 'react-native-reanimated';

    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];

    const AnimatedPath = Animated.createAnimatedComponent(Path);

    export default function App() {
      const [currentColor, setCurrentColor] = useState('#FF0000');
      const paths = useSharedValue([]);

      const onGestureEvent = useAnimatedGestureHandler({
        onStart: (event, ctx) => {
          ctx.path = `M${event.x},${event.y}`;
        },
        onActive: (event, ctx) => {
          ctx.path += ` L${event.x},${event.y}`;
          paths.value = [...paths.value, { path: ctx.path, color: currentColor }];
        },
        onEnd: () => {
          paths.value = [...paths.value];
        }
      });

      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.colorPicker}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorButton, { backgroundColor: color }]}
                  onPress={() => setCurrentColor(color)}
                />
              ))}
            </View>
            <View style={styles.canvasContainer}>
              <Canvas style={styles.canvas}>
                {paths.value.map((item, index) => (
                  <AnimatedPath
                    key={index}
                    d={item.path}
                    stroke={item.color}
                    strokeWidth={5}
                    fill="none"
                  />
                ))}
              </Canvas>
              <Animated.View
                style={StyleSheet.absoluteFill}
                onTouchStart={onGestureEvent}
                onTouchMove={onGestureEvent}
              />
            </View>
          </View>
        </GestureHandlerRootView>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
      },
      colorPicker: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
      },
      colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
      },
      canvasContainer: {
        flex: 1,
        margin: 20,
        borderWidth: 1,
        borderColor: '#000',
      },
      canvas: {
        flex: 1,
      },
    });
