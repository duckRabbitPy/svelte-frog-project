<script>

import Header from "./UI/Header.svelte";
import AdoptGrid from "./Adoption/AdoptGrid.svelte";
import CustomButton from "./UI/CustomButton.svelte";
import EditAdopt from "./Adoption/EditAdopt.svelte";
import Intro from "./UI/Intro.svelte";
import Quiz from "./Quiz/Quiz.svelte";
import Footer from "./UI/Footer.svelte";
import About from "./UI/About.svelte";
import Modal from "./UI/Modal.svelte";
import Dashboard from "./Dashboard/Dashboard.svelte";
import Game from "./Game/Game.svelte";
import Leaderboard from "./Game/Leaderboard.svelte";
import lillyPadEditor from "./Dashboard/LillyPadEditor.svelte";


import Cart from "./Cart/Cart.svelte";
import CheckOut from "./Cart/CheckOut.svelte"
import Products from "./Products/Products.svelte";
import Feedback from "./UI/Feedback.svelte";
import Credit from "./Quiz/Credit.svelte";

import { total } from "./Cart/cart-store.js";
import { darkModeOn } from "./UI/DarkModeStore.js";
import Toggle from "svelte-toggle";


//fireBase Auth added to App.svelte so only initalised once
//added to .gitIgnore
import { firebaseConfig } from "./helpers/firebaseConfig.js"
import firebase from 'firebase/app';
import Auth from './Auth.svelte';
import Orphan from "./Adoption/Orphan.svelte";
import Carousel from "./UI/Carousel.svelte";
import LillyPadEditor from "./Dashboard/LillyPadEditor.svelte";


firebase.initializeApp(firebaseConfig);

let toggled = false;

$: if (toggled === true){
    darkModeOn.set(toggled);
}

$: if (toggled === false){
    darkModeOn.set(toggled);
}


let mainPage = true;
let playQuiz = false;
let goShop = false;
let showCart = true;
let editMode = null;
let loginModal = null;
let checkOutMode = null;
let aboutPage = false;
let feedback = false;
let goDashBoard = false;
let gameInPlay = false;
let loggedInAsGuest = false;
let hideButtonsforGame = false;
let showLeaderboard = false;
let openGallery = false;
let lillyPadEdit = false;
let newGame = false;

let orphans = [{}]
let orphaned = false;
let score = 0;



  const images = [
        {path: 'images/frog1.jpg', id: 'image1'},
        {path: 'images/frog2.jpg', id: 'image2'},
        {path: 'images/frog3.jpg', id: 'image3'},
        {path: 'images/frog4.jpg', id: 'image4'},
        {path: 'images/frog5.jpg', id: 'image5'},
        {path: 'images/frog6.jpg', id: 'image6'},
        {path: 'images/frog7.jpg', id: 'image7'},
        {path: 'images/frog8.jpg', id: 'image8'},
    ]


    let frogs = [ 
        {id: '1sp',
        title: 'Gerald',
        subtitle: "White's Tree frog",
        description: 'Gerald is a very polite frog and needs a home and someone to love him',
        imageUrl: '/images/treeFrog.png',
        address: '34 Blackstock road, Stockwell, SW9 S3T, London',
        contact: 'adoptPhrogesLondon@gmail.com',
        isFavourite: false,
    },

    {id: '1bg',
        title: 'Maurice and Natalie',
        subtitle: 'Green Tree frogs',
        description: 'Two lovely frogs that are looking for new owners, well behaved and easy to clean up after',
        imageUrl: '/images/twoFrogs.jpeg',
        address: '321 Seven sisters road, Finsbury Park, N17 4FA, London',
        contact: 'adoptPhrogesLondon@gmail.com',
        isFavourite: false,
    },
    {id: '1rt',
        title: 'Arnold',
        subtitle: 'African clawed frog',
        description: "Somewhat strange but fiercely loyal, Arnold hasn't had the easiest life, it's time to give him a chance",
        imageUrl: '/images/xenopus.jpeg',
        address: '11 Regents Street, C12 WEB, London',
        contact: 'adoptPhrogesLondon@gmail.com',
        isFavourite: false,
    },
    
    {id: '1an',
        title: 'Rosie',
        subtitle: 'Dart frog',
        description: 'Deceivingly clever and not to be messed with, rosie was rescued from an eccentric drug dealer and full time party person. She now needs to peace and quiet ',
        imageUrl: '/images/dartFrog.jpeg',
        address: '321 Seven sisters road, Finsbury Park, N17 4FA, London',
        contact: 'adoptPhrogesLondon@gmail.com',
        isFavourite: false,
    },
    {id: '1sc',
        title: 'Begby',
        subtitle: 'sprinkled long reed frog',
        description: "Don't mess with Begby. Not once, not ever.",
        imageUrl: '/images/toad.jpg',
        address: 'flat 5, South Bridge, Edinburgh EH8 9YL',
        contact: 'adoptPhrogesLondon@gmail.com',
        isFavourite: false,
    },
    {id: '1hp',
        title: 'Misty',
        subtitle: 'no idea...I mean what!!??!',
        description: "Very laid back frog rescued from a hippy commune in Thailand, her song is very pleasant to listen to at night, easy to look after so long as you don't play loud psytrance music",
        imageUrl: '/images/rainbow.jpg',
        address: 'flat 5, South Bridge, Edinburgh EH8 9YL',
        contact: 'adoptPhrogesLondon@gmail.com',
        isFavourite: false,
    },
  ]

    function addFrog(event){
        const newFrog = {
            title: event.detail.title,
            subtitle: event.detail.subtitle,
            description: event.detail.description,
            imageUrl: event.detail.imageUrl,
            address: event.detail.address,
            contact: event.detail.contact,
        }

        if(title != '' && subtitle != ''){
        orphans = newFrog
        editMode = null;
        orphaned = true;

    }}


    function toggleFavourite(event){
        const id = event.detail;
        //find is a new piece of modern JS
        const updatedFrog = { ...frogs.find(m => m.id === id)};
        updatedFrog.isFavourite = !updatedFrog.isFavourite;
        const frogIndex = frogs.findIndex(m => m.id === id);
        const updatedFrogs = [...frogs];
        updatedFrogs[frogIndex] = updatedFrog;
        frogs = updatedFrogs;
    }


    function cancelForm(event){
        editMode = 'null';
    }

    function showLogin(event){
        loginModal = 'log';
    }

    function logOutGuest(event){
      loggedInAsGuest = false
    }

    function showCheckOut(event){
        checkOutMode = 'checkOut';
    }

    function hideCheckOut(event){
        checkOutMode = null;
    }

    function hideLogin(event){
        loginModal = null
    }

    function showDashBoard(event){
        loginModal = null;
        mainPage = false;
        goDashBoard = true;
        feedback = false;
        goShop = false; 
        aboutPage = false; 
        playQuiz = false;
        lillyPadEdit = false;
        openGallery = false;
        
    }

    function playGame(){
      gameInPlay = true
      goDashBoard = false
    }

    $:if (gameInPlay === true && newGame) {
      if(window.innerWidth < 900) {
          hideButtonsforGame = true
        }}


    function endGame(event){
      hideButtonsforGame = false;
      showLeaderboard = true
      score = event.detail.score
      console.log(score)
    }

    function viewGallery(event){
      openGallery = true
    }

    function editText(event){
      lillyPadEdit = true
    }

</script>

<style>
    main {
        margin-top: 5rem;
    }

    .h1-light { padding: 1rem; color: black;}
    
    .h1-dark {padding: 1rem; color: rgb(206, 206, 206);}

    .formControl {
        margin: 1rem;
    }

    .login:hover {
      background-color: lightgray;
      border-color: lightslategrey;
    }

    .toggle {
        margin: 1rem;
    }

    .darkMode{
      width: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      background-color: rgb(58, 58, 58);
      overflow-y:scroll;
      overflow-x:hidden;
    }

    .lightMode{
      width: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      background-color: white;
      overflow-y:scroll;
      overflow-x:hidden;
    }


    button:hover {
      background: #9a476b;
      border-color: #9a476b;

    }

    .rehome-light{
    font: inherit;
    border-color: #646668;
    background-color: #646668;
    padding: 0.5rem 1rem;
    color: white;
    margin-left: 1rem;
    border-radius: 5px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.26);
    cursor: pointer;
    text-decoration: none;
  }

    .rehome-dark{
      font: inherit;
      border-color: #324A5E;
      background-color: #324A5E;
      padding: 0.5rem 1rem;
      margin-left: 1rem;
      color: white;
      border-radius: 5px;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.26);
      cursor: pointer;
      text-decoration: none;
    }




</style>


<div class={$darkModeOn ? "darkMode" : "lightMode"}>
<Header/>
<main>
  {#if hideButtonsforGame === false}
    <div class="formControl">
    <CustomButton stateColour="{mainPage ? "selectedPage" : ''}" btntype="submit" on:click="{() => {goDashBoard = false; playQuiz = false; goShop = false; feedback = false; mainPage = true; aboutPage = false; openGallery = false; lillyPadEdit = false; showLeaderboard = false;}}">Main</CustomButton>
    <CustomButton stateColour="{aboutPage ? "selectedPage" : ''}" btntype="submit" on:click="{() => {goDashBoard = false; playQuiz = false; goShop = false; feedback = false; mainPage = false; aboutPage = true; openGallery = false; lillyPadEdit = false; showLeaderboard = false;}}">About</CustomButton>
    <CustomButton stateColour="{playQuiz ? "selectedPage" : ''}" btntype="submit" on:click="{() => {goDashBoard = false; playQuiz = true; goShop = false; feedback = false; mainPage = false; aboutPage = false; openGallery = false; lillyPadEdit = false; showLeaderboard = false;}}">Nature Quiz</CustomButton>
    <CustomButton stateColour="{goShop ? "selectedPage" : ''}" btntype="submit" on:click="{() => {goDashBoard = false; playQuiz = false; goShop = true; feedback = false; mainPage = false; aboutPage = false; openGallery = false; lillyPadEdit = false; showLeaderboard = false}}">Frog Shop</CustomButton>
    <CustomButton stateColour="{feedback ? "selectedPage" : ''}" btntype="submit" on:click="{() => {goDashBoard = false; playQuiz = false; goShop = false; feedback = true; mainPage = false; aboutPage = false; openGallery = false; lillyPadEdit = false; showLeaderboard = false}}">Give Feedback</CustomButton>
    <CustomButton btntype="submit" stateColour={$darkModeOn ? "secondary-dark" : "secondary-light"}  on:click="{showLogin}">Premium dashboard</CustomButton>

    <Toggle hideLabel label="Custom label" bind:toggled />
    </div>
    {/if}

    {#if editMode === 'add'}
    <EditAdopt on:adoption-submit="{addFrog}" on:cancel="{cancelForm}"/>
    {/if}

    {#if loginModal === 'log'}
    <Modal title="Proceed to Dashboard" on:cancel={()=>{loginModal = false}}>
        <div>
            <div class="wrapper">
              <!-- slot input -->
                <Auth
                  useRedirect={true}
                  let:user
                  let:loggedIn
                  let:loginWithGoogle
                  let:logout>
                  
                {#if !loggedIn || !loggedInAsGuest}
                <p>You must sign in/register to view Dashboard</p>
                 {/if}
                  {#if loggedIn || loggedInAsGuest}
                    <div>
                      <div>
                        <h2>Logged in as {loggedIn ? user.email : "Guest"}</h2>
                        <!-- button and function that is only clickable if logged-in is true -->
                        <CustomButton btntype="submit" on:click={showDashBoard}>Go to dashboard!</CustomButton>
                        <button type="button" on:click={logOutGuest} on:click={logout}>Logout</button>
                      </div>
                    </div>
                  {:else}
                    <div>
                      <form on:submit|preventDefault>
                        <div>
                          <!-- Keeping login and auth local for security purposes -->
                          <!-- <button class="login" type="button" on:click|preventDefault={loginWithGoogle}>
                            Sign In with Google
                          </button> -->
                        </div>
                        <div>
                          <button class="login" type="button" on:click|preventDefault={()=>{loggedInAsGuest = true}}>
                            Sign In as Guest
                          </button>
                        </div>
                      </form>
                    </div>
                  {/if}
                </Auth>
              </div>
        </div>
        <div slot="footer">
            <CustomButton btntype="button" on:click="{() => {loginModal = false}}">Cancel</CustomButton>
        </div> 
        </Modal>
        
    {/if}

    {#if goDashBoard === true && playQuiz === false && goShop === false && feedback === false && mainPage === false && aboutPage === false && openGallery === false && lillyPadEdit === false}
    <Dashboard on:memory-game="{playGame}" on:view-gallery="{viewGallery}" on:text-edit="{editText}"/>
    {/if}

    {#if showLeaderboard === true && gameInPlay === true}
    <Leaderboard score={score} on:close-board="{()=>{showLeaderboard = false}}"/>
    {/if}

    {#if gameInPlay === true && goDashBoard === false && playQuiz === false && goShop === false && feedback === false && mainPage === false && aboutPage === false && openGallery === false && lillyPadEdit === false}
    <Game on:game-over="{endGame}" on:game-started="{()=>{newGame = true}}"/>
    {/if}

    {#if openGallery === true}
    <Carousel images={images} imageWidth={window.innerWidth < 900 ? "200" : "300"} imageSpacing={'30px'} />
    {/if}

    {#if lillyPadEdit === true}
    <LillyPadEditor />
    {/if}
    

    {#if checkOutMode === 'checkOut'}
    <CheckOut on:cancel-checkOut="{hideCheckOut}"/>
    {/if}

    {#if goDashBoard === false && playQuiz === true && goShop === false && feedback === false && mainPage === false && aboutPage === false && openGallery === false}
    <Quiz />
    <Credit />
    {/if}

    {#if goDashBoard === false && playQuiz === false && goShop === false && feedback === true && mainPage === false && aboutPage === false && openGallery === false} 
    <Feedback feedUser="Oli" feedComment="Awesome" numStars=5 />
    {/if}


    {#if goDashBoard === false && playQuiz === false && goShop === false && feedback === false && mainPage === true && aboutPage === false && openGallery === false}
    <button class={$darkModeOn ? "rehome-dark" : "rehome-light"} on:click="{() => editMode = 'add'}">Re-home your frog</button>
    <Intro>"Don't be a fish; be a frog. Swim in the water and jump when you hit ground" - Kim Young-ha</Intro>
    
    {#if orphaned === true}
    <h1 class={$darkModeOn ? "h1-dark" : "h1-light"}>Your Re-homing Advert</h1>
    <Orphan {orphans} on:remove={()=>{orphaned=false; orphans=[{}]}}/>
    {/if}
    <h1 class={$darkModeOn ? "h1-dark" : "h1-light"}>Current fogs in need of a home</h1>
    <AdoptGrid {frogs}  on:toggle-favourite="{toggleFavourite}"/>
    {/if}

    {#if goDashBoard === false && playQuiz === false && goShop === false && feedback === false && mainPage === false && aboutPage === true}
    <About/>
    {/if}

    {#if goDashBoard === false && playQuiz === false && goShop === true && feedback === false && mainPage === false && aboutPage === false}
    <div class="toggle">
    <CustomButton stateColour={$darkModeOn ? "secondary-dark" : "secondary-light"} on:click={() => {showCart = !showCart;}}>
        Toggle Cart
    </CustomButton>
    <CustomButton stateColour={$darkModeOn ? "secondary-dark" : "secondary-light"} on:click="{showCheckOut}">CheckOut</CustomButton>
    </div>
    {#if showCart}
    <Cart total={$total}/>
    {/if}
    <Products />
    {/if}
    <Footer />
</main>
</div>






