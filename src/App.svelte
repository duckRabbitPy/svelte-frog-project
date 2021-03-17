<script>

import Header from "./UI/Header.svelte";
import AdoptGrid from "./Adoption/AdoptGrid.svelte";
import CustomButton from "./UI/CustomButton.svelte";
import EditAdopt from "./Adoption/EditAdopt.svelte";
import Adopt from "./Adoption/Adopt.svelte";
import Intro from "./UI/Intro.svelte";
import Quiz from "./Quiz/Quiz.svelte";
import Footer from "./UI/Footer.svelte";
import About from "./UI/About.svelte";

import Cart from "./Cart/Cart.svelte";
import CheckOut from "./Cart/CheckOut.svelte"
import Products from "./Products/Products.svelte";
import Feedback from "./UI/Feedback.svelte";
import Credit from "./Quiz/Credit.svelte";

import { total } from "./Cart/cart-store.js";
import { darkModeOn } from "./UI/DarkModeStore.js";
import Toggle from "svelte-toggle";

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
let adoptMode = null;
let checkOutMode = null;
let aboutPage = false;
let feedback = false;


    let frogs = [ 
        {id: '1sp',
        title: 'Gerald',
        subtitle: "White's Tree frog",
        description: 'Gerald is a very polite frog and needs a home and someone to love him',
        imageUrl: 'https://www.reptilecentre.com/sites/Reptile/img/category-header/white-tree-frog-care.jpg',
        address: '34 Blackstock road, Stockwell, SW9 S3T, London',
        contact: 'svelteLondonSoc@gmail.com',
        isFavourite: false,
    },

    {id: '1bg',
        title: 'Maurice and Natalie',
        subtitle: 'Green Tree frogs',
        description: 'Two lovely frogs that are looking for new owners, well behaved and easy to clean up after',
        imageUrl: 'https://images.creativemarket.com/0.1.0/ps/4367698/1820/1208/m1/fpnw/wm1/rr5eyoggepciup7ilsiqxibka6y9tb02uccxj2ll7df6bmzr81mftor1bogxhnyr-.jpg?1524810279&s=47f7a973b02514e15513039a4f16eb31',
        address: '321 Seven sisters road, Finsbury Park, N17 4FA, London',
        contact: 'svelteLondonSoc@gmail.com',
        isFavourite: false,
    },
    {id: '1rt',
        title: 'Arnold',
        subtitle: 'African clawed frog',
        description: "Somewhat strange but fiercely loyal, Arnold hasn't had the easiest life, it's time to give him a chance",
        imageUrl: 'https://www.aqualog.de/wp-content/uploads/2017/08/xenopus-albino2.jpg',
        address: '11 Regents Street, C12 WEB, London',
        contact: 'svelteLondonSoc@gmail.com',
        isFavourite: false,
    },
    
    {id: '1an',
        title: 'Rosie',
        subtitle: 'Dart frog',
        description: 'Deceivingly clever and not to be messed with, rosie was rescued from an eccentric drug dealer and full time party person. She now needs to peace and quiet. ',
        imageUrl: 'https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F28638272-6943-11ea-b96a-000a4e1a8b0c.jpg?crop=3959%2C2639%2C0%2C0',
        address: '321 Seven sisters road, Finsbury Park, N17 4FA, London',
        contact: 'svelteLondonSoc@gmail.com',
        isFavourite: false,
    },]

    function addFrog(event){
        const newFrog = {
            id: Math.random().toString() + 'ua',
            title: event.detail.title,
            subtitle: event.detail.subtitle,
            description: event.detail.description,
            imageUrl: event.detail.imageUrl,
            address: event.detail.address,
            contact: event.detail.contact,
        }

        if(title != '' && subtitle != ''){
        // nice modern JS syntax for adding items to list
        frogs = [newFrog, ...frogs]}

        editMode = null;

    }


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

    function showAdopt(event){
        adoptMode = 'adopt';
    }

    function showCheckOut(){
        checkOutMode = 'checkOut';
    }

    function hideCheckOut(event){
        checkOutMode = null;
    }

    function hideAdopt(event){
        adoptMode = null
    }


</script>

<style>
    main {
        margin-top: 5rem;
    }

    .formControl {
        margin: 1rem;
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


</style>


<div class={$darkModeOn ? "darkMode" : "lightMode"}>
<Header/>
<main>
    <div class="formControl">
    <CustomButton btntype="submit" on:click="{() => {mainPage = true; aboutPage = false; playQuiz = false; goShop = false; feedback = false;}}">Main</CustomButton>
    <CustomButton btntype="submit" on:click="{() => {aboutPage = true; mainPage = false; playQuiz = false; goShop = false; feedback = false;}}">About</CustomButton>
    <CustomButton btntype="submit" on:click="{() => editMode = 'add'}">Re-home your frog</CustomButton>
    <CustomButton btntype="submit" on:click="{() => {playQuiz = true; aboutPage = false; goShop = false; feedback = false;}}">Nature Quiz</CustomButton>
    <CustomButton btntype="submit" on:click="{() => {goShop = true; aboutPage = false; playQuiz = false; feedback = false;}}">Frog Shop</CustomButton>
    <CustomButton btntype="submit" on:click="{() => {feedback = true; mainPage = false; goShop = false; aboutPage = false; playQuiz = false;}}">Give Feedback</CustomButton>
    <Toggle hideLabel label="Custom label" bind:toggled />
    
</div>

    {#if editMode === 'add'}
    <EditAdopt on:adoption-submit="{addFrog}" on:cancel="{cancelForm}"/>
    {/if}

    {#if adoptMode === 'adopt'}
    <Adopt on:cancel-adopt="{hideAdopt}"/>
    {/if}

    {#if checkOutMode === 'checkOut'}
    <CheckOut on:cancel-checkOut="{hideCheckOut}"/>
    {/if}

    {#if playQuiz === true && goShop === false && feedback === false}
    <Quiz />
    <Credit />
    {/if}

    {#if feedback === true && playQuiz === false  && goShop === false}
    <Feedback feedUser="Oli" feedComment="Awesome" numStars=5 />
    {/if}


    {#if mainPage === true && playQuiz === false && goShop === false && feedback === false}
    <Intro>"Don't be a fish; be a frog. Swim in the water and jump when you hit ground" - Kim Young-ha</Intro>
    <AdoptGrid {frogs}  on:toggle-favourite="{toggleFavourite}" on:adopt-event="{showAdopt}"/>
    {/if}

    {#if aboutPage === true}
    <About/>
    {/if}

    {#if goShop === true && playQuiz === false}
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






