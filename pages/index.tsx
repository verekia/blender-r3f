import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import GlbWatcher from '@/components/GlbWatcher'
import { useQuery } from '@tanstack/react-query'

const Cube = () => {
  const { scene } = useGLTF('./cube.glb')
  useQuery({ queryKey: ['./cube.glb'], queryFn: () => null })

  return <primitive object={scene} />
}

const Plane = () => {
  const { scene } = useGLTF('./plane.glb')
  useQuery({ queryKey: ['./plane.glb'], queryFn: () => null })

  return <primitive object={scene} />
}

const Scene = () => (
  <>
    <OrbitControls>
      <PerspectiveCamera makeDefault position={[0, 4, 10]} />
    </OrbitControls>
    <Cube />
    <Plane />
    <GlbWatcher />
    <directionalLight position={[4, 4, 4]} intensity={2} />
    <ambientLight intensity={1} />
  </>
)

const IndexPage = () => (
  <Canvas>
    <Scene />
  </Canvas>
)

export default IndexPage
