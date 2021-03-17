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

    p {
        color: red;
    }
</style>

    <Modal title="Adopting a frog" on:cancel>
    <form in:fade>
    <div>
        <label for="Username">Username</label>
        <input type="text">
    </div>
    <div>
        <label for="Password">Password</label>
        <input type="text">
    </div>
        <p>You must sign in/register to adopt a frog</p>
        <CustomButton btntype="submit" >Sign in</CustomButton>
    </form>
    <div slot="footer">
        <CustomButton btntype="submit" >Register</CustomButton>
        <CustomButton btntype="button" on:click="{cancel}">Cancel</CustomButton>
    </div>
    </Modal>
