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
import { Dimensions } from "react-native";

const WIDTH = Dimensions.get("screen").width;

interface FetchLoaderProps {
  showing?: boolean;
}

export const FetchLoader: FC<FetchLoaderProps> = memo(({ showing }) => {
  const anim = useSharedValue(-1);

  useEffect(() => {
    anim.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.ease }),
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
            [-1, 0, 1],
            [0, 2, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }),
    [],
  );
  if (showing) return <Loader style={[loaderStyle]} />;

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
`;

const PlaceHolder = styled.View`
  height: 4px;
`;
