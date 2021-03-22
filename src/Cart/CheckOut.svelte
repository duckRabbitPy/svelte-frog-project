<script>
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from "svelte";
    import CustomButton from "../UI/CustomButton.svelte";
    import Modal from "../UI/Modal.svelte";
    import { get } from 'svelte/store';
    import cart, { total } from "../Cart/cart-store.js";
    import { beforeUpdate, afterUpdate } from 'svelte';
   

    let checkItems;
    let code = "Enter discount code"
    let applyDiscount = false 


    function checkCode(){
        if(code === "frog21"){
            applyDiscount = true

        }
        else{code = "invalid code"}
    }

    afterUpdate(()=>{
        let currItems = get(cart);
        let arr = []
        for(let x =0; x<currItems.length; x++){
        arr.push(currItems[x].title)
    }
    checkItems = arr})

    
    
    const dispatch = createEventDispatcher();
    
    function cancel() {
          dispatch('cancel-checkOut');
      }
        
    </script>
    
    <style>
        form {
            width: 100%;
        }

        img {
            height: 100px;
        }

        p { color: red;}

    </style>
    
        <Modal title="CheckOut" on:cancel={cancel}>
        <form in:fade>
        
        </form>
        {#if checkItems}
        {#each checkItems as checkItem}
        <li>{checkItem}</li>
        {/each}
        {/if}
        <h3>£{applyDiscount ? (Math.round($total/3)) : $total} for all that 🐸🐸🐸 goodness, what a bargain!</h3>
        <a href="https://media1.tenor.com/images/c303c5f5a6a80558f71af8b35cf1c6c5/tenor.gif?itemid=8664380" target="blank"><img src="https://support.pixelunion.net/hc/article_attachments/360060934313/Additional_checkout_buttons_on_the_cart_page.png" alt="dummyPayment"></a>
        <input on:focus="{()=>{code = ""}}" bind:value={code}>
        <p>Demo site: no payment or financial details will be taken</p>
        <div slot="footer">
            <CustomButton btntype="button" on:click="{cancel}">Cancel</CustomButton>
            <CustomButton on:click="{checkCode}">Apply discount</CustomButton>
        </div>
        </Modal>
    