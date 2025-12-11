<template>
  <div class="starry-background">
    <div class="stars" v-for="n in 200" :key="n" :style="getStarStyle(n)"></div>
    <div class="twinkling"></div>
    <div class="glowing-particles">
      <div class="particle" v-for="n in 5" :key="`particle-${n}`" :style="getParticleStyle(n)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
function getStarStyle(index: number) {
  const size = Math.random() * 2 + 0.5;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const animationDelay = Math.random() * 3;
  const animationDuration = Math.random() * 3 + 2;
  const opacity = Math.random() * 0.5 + 0.3;
  
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`,
    opacity: opacity
  };
}

function getParticleStyle(index: number) {
  const size = Math.random() * 100 + 50;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const animationDelay = Math.random() * 5;
  const animationDuration = Math.random() * 10 + 10;
  
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`
  };
}
</script>

<style scoped>
.starry-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;
  pointer-events: none;
}

.stars {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle linear infinite;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8), 0 0 12px rgba(91, 200, 91, 0.4);
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
    box-shadow: 0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(91, 200, 91, 0.6);
  }
}

.twinkling {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="0.5" fill="white" opacity="0.8"/></svg>') repeat;
  background-size: 200px 200px;
  animation: move-twink-back 200s linear infinite;
  opacity: 0.4;
}

@keyframes move-twink-back {
  from {
    background-position: 0 0;
  }
  to {
    background-position: -10000px 5000px;
  }
}

/* Glowing particles effect */
.glowing-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(91, 200, 91, 0.3) 0%, transparent 70%);
  animation: float linear infinite;
  filter: blur(20px);
}

@keyframes float {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(50px, -50px) scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform: translate(100px, -100px) scale(1);
    opacity: 0.3;
  }
}

.starry-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 50%, rgba(91, 200, 91, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(91, 200, 91, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 60% 40%, rgba(147, 51, 234, 0.06) 0%, transparent 50%);
  animation: pulse-glow 8s ease-in-out infinite;
  z-index: 0;
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>
