import type { FC } from "react";
import React, { memo, useEffect } from "react";
import styled from "styled-components/native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import type { ViewStyle } from "react-native";
import { Dimensions } from "react-native";

const WIDTH = Dimensions.get("screen").width;

interface FetchLoaderProps {
  style?: ViewStyle;
  showing?: boolean;
}

export const FetchLoader: FC<FetchLoaderProps> = memo(({ style, showing }) => {
  const anim = useSharedValue(-1);

  useEffect(() => {
    anim.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.ease }),
      -1,
      true,
    );
  }, []);

  const loaderStyle = useAnimatedStyle(
    () => ({
      //@ts-ignore
      transform: [
        {
          scaleX: interpolate(
            anim.value,
            [-0.8, 0, 0.8],
            [0.05, 0.8, 0.05],
            Extrapolation.CLAMP,
          ),
        },
        {
          translateX: interpolate(
            anim.value,
            [-1, -0.85, 0, 0.85, 1],
            [-WIDTH * 0.55, -WIDTH * 0.5, 0, WIDTH * 0.5, WIDTH * 0.55],
          ),
        },
      ],
    }),
    [],
  );
  if (showing) return <Loader style={[loaderStyle, style]} />;

  return <PlaceHolder />;
});

FetchLoader.displayName = "FetchLoader";

FetchLoader.defaultProps = {
  showing: true,
};

const Loader = styled(Animated.View)`
  width: ${global.width}px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
  z-index: 999;
  position: absolute;
  top: 50;
  left: 0;
  right: 0;
`;

const PlaceHolder = styled.View`
  height: 4px;
`;
