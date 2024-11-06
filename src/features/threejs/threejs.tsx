import { Canvas } from "@react-three/fiber";

export default function Threejs() {
    return (
        <>
            <Canvas>
                <ambientLight intensity={0.1} />
                <directionalLight color="red" position={[0, 0, 5]} />
                <mesh visable useData={{ hello: '' }} scale={1} rotation={[Math.PI / 2, 0, 0]} >
                    <sphereGeometry args={[1, 32]} />
                    <boxGeometry args={[2, 2, 2]}></boxGeometry>
                    <meshStandardMaterial />
                </mesh>
            </Canvas>
        </>
    );
}