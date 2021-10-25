import React, { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Mesh } from 'three'

const Box: React.FC = () => {
  const mesh = useRef<Mesh>(null)

  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  return (
    <mesh
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const App: React.FC = () => {
  return (
    <>
      <div>Hello from App1</div>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box />
      </Canvas>
    </>
  )
}

export default App
