import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Prueba } from "./Prueba";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="Prueba"
        component={Prueba}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
