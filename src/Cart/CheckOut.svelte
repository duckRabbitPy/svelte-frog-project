<script>
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from "svelte";
    import CustomButton from "../UI/CustomButton.svelte";
    import Modal from "../UI/Modal.svelte";
    import { total } from "../Cart/cart-store"
    
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
    
        <Modal title="CheckOut" on:cancel>
        <form in:fade>
        
        </form>
        <h3>£{$total} for all that 🐸🐸🐸 goodness, what a bargain!</h3>
        <img src="https://support.pixelunion.net/hc/article_attachments/360060934313/Additional_checkout_buttons_on_the_cart_page.png" alt="dummyPayment">
        <p>Demo site: no payment or financial details will be taken</p>
        <div slot="footer">
            <CustomButton btntype="button" on:click="{cancel}">Cancel</CustomButton>
        </div>
        </Modal>
    