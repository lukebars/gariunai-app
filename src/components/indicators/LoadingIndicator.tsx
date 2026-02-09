import type { FC } from "react";
import React, { memo, useEffect } from "react";
import { Dimensions } from "react-native";
import styled from "styled-components/native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface FetchLoaderProps {
  showing?: boolean;
  height?: number;
}

export const FetchLoader: FC<FetchLoaderProps> = memo(
  ({ showing, height = 4 }) => {
    const shimmer = useSharedValue(0);
    const visibility = useSharedValue(0);

    useEffect(() => {
      shimmer.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        false,
      );
    }, []);

    useEffect(() => {
      visibility.value = withTiming(showing ? 1 : 0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    }, [showing]);

    const backgroundStyle = useAnimatedStyle(
      () => ({
        opacity: visibility.value,
        transform: [
          {
            translateY: interpolate(visibility.value, [0, 1], [-height / 2, 0]),
          },
        ],
      }),
      [height],
    );

    const shimmerStyle = useAnimatedStyle(
      () => ({
        transform: [
          {
            translateX: interpolate(
              shimmer.value,
              [0, 1],
              [-SCREEN_WIDTH, SCREEN_WIDTH],
            ),
          },
        ],
        opacity: interpolate(
          shimmer.value,
          [0, 0.2, 0.5, 0.8, 1],
          [0, 0.5, 0.7, 0.5, 0],
        ),
      }),
      [],
    );

    return (
      <LoaderBackground height={height} style={backgroundStyle}>
        <ShimmerBar style={shimmerStyle} />
      </LoaderBackground>
    );
  },
);

FetchLoader.displayName = "FetchLoader";

const LoaderBackground = styled(Animated.View)<{ height: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: ${({ height }) => height}px;
  background-color: #1e8a35;
  overflow: hidden;
  pointer-events: none;
`;

const ShimmerBar = styled(Animated.View)`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 100px;
`;
