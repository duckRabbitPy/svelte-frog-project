<script>
    import { flip } from 'svelte/animate';
    import { darkModeOn } from "./DarkModeStore.js";
  
    export let images;
    export let imageWidth = 300;
    export let imageSpacing = 20;
    export let speed = 500;
    export let controlColor= '#444';
    export let controlScale = '0.5';

    console.log("working")
    console.log(images)
  
  
    const rotateLeft = e => {
      const transitioningImage = images[images.length - 1]
      document.getElementById(transitioningImage.id).style.opacity = 0;
      images = [images[images.length -1],...images.slice(0, images.length - 1)]
      setTimeout(() => (document.getElementById(transitioningImage.id).style.opacity = 1), speed);
    }
  
    const rotateRight = e => {
      const transitioningImage = images[0]
      document.getElementById(transitioningImage.id).style.opacity = 0;
      images = [...images.slice(1, images.length), images[0]]
      setTimeout(() => (document.getElementById(transitioningImage.id).style.opacity = 1), speed);
    }
  </script>

<style>
    #carousel-container {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }
    #carousel-images {
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      -webkit-mask: linear-gradient(
        to right,
        transparent,
        black 40%,
        black 60%,
        transparent
      );
      mask: linear-gradient(
        to right,
        transparent,
        black 40%,
        black 60%,
        transparent
      );
    }
  
    button {
     position: absolute;
     top: 50%;
     transform: translateY(-50%);
     display: flex;
     align-items: center;
     justify-content: center;
     background: transparent;
     border: none;
   }
  
   button:focus {
     outline: auto;
   }
  
    #left {
      left: 10px;
    }
  
    #right {
      right: 10px;
    }

    h1 {margin-left: 1rem}

    .h1-light { margin-left: 1rem; padding-top: 0.5rem; color: black;}

    .h1-dark { margin-left: 1rem; color: rgb(206,205,206); padding-top: 0.5rem;}

    .svg-light{
        color: black;
    }

    .svg-dark{
        color: rgb(206,205,206)
    }
  
  </style>

  <!-- credit for component: https://dev.to/bmw2621/build-an-image-carousel-with-svelte-4kf8 -->

  <h1 class="{$darkModeOn ? "h1-dark" : "h1-light"}">My Dwarf Frog Gallery</h1>
  <div id="carousel-container">
    <div id="carousel-images">
      {#each images as image (image.id)}
        <img
          src={image.path}
          alt={image.id}
          id={image.id}
          style={`width:${imageWidth}px; margin: 0 ${imageSpacing}px;`}
          animate:flip={{duration: speed}}/>
      {/each}
    </div>
    <button id="left" on:click={rotateLeft}>
      <slot name="left-control">
        <svg width="39px" height="110px" id="svg8" transform={`scale(${controlScale})`}>
          <g id="layer1" transform="translate(-65.605611,-95.36949)">
            <path
            style={`fill:none;stroke:${$darkModeOn ? '#cecdce' : controlColor};stroke-width:9.865;stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1`}
            d="m 99.785711,100.30199 -23.346628,37.07648 c -7.853858,12.81098 -7.88205,12.81098 0,24.78902 l 23.346628,37.94647"
            id="path1412" />
          </g>
        </svg>
      </slot>
    </button>
    <button id="right" on:click={rotateRight}>
      <slot name="right-control">
        <svg width="39px" height="110px" id="svg8" transform={`rotate(180) scale(${controlScale})`}>
          <g id="layer1" transform="translate(-65.605611,-95.36949)">
            <path
            style={`fill:none;stroke:${$darkModeOn ? '#cecdce' : controlColor};stroke-width:9.865;stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1`}
            d="m 99.785711,100.30199 -23.346628,37.07648 c -7.853858,12.81098 -7.88205,12.81098 0,24.78902 l 23.346628,37.94647"
            id="path1412" />
          </g>
        </svg>
      </slot>
  </div>
  
