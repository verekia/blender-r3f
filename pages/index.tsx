import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import GlbWatcher from '@/components/GlbWatcher'
import { useQuery } from '@tanstack/react-query'

const Cube = () => {
  const path = './cube.glb'
  const { scene } = useGLTF(path)
  useQuery({ queryKey: [path], queryFn: () => null })
  console.log('Cube rendered')

  return <primitive object={scene} />
}

const Plane = () => {
  const path = './plane.glb'
  const { scene } = useGLTF(path)
  useQuery({ queryKey: [path], queryFn: () => null })
  console.log('Plane rendered')

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
