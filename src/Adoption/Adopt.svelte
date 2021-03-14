<script>
import { fade } from 'svelte/transition';
import { createEventDispatcher } from "svelte";
import CustomButton from "../UI/CustomButton.svelte";
import Modal from "../UI/Modal.svelte";

const dispatch = createEventDispatcher();

function cancel() {
      dispatch('cancel-adopt');
  }
    
</script>

<style>
    form {
        width: 100%;
    }
</style>

    <Modal title="Adopting a frog" on:cancel>
    <form in:fade>
    
    </form>
    <div slot="footer">
        <CustomButton btntype="submit" >Next Steps!</CustomButton>
        <CustomButton btntype="button" on:click="{cancel}">Cancel</CustomButton>
    </div>
    </Modal>
