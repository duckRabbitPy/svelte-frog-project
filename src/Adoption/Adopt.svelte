<script>
import { fade } from 'svelte/transition';
import { createEventDispatcher } from "svelte";
import CustomButton from "../UI/CustomButton.svelte";
import Modal from "../UI/Modal.svelte";

//added to .gitIgnore
import { firebaseConfig } from "./firebaseConfig.js"


import firebase from 'firebase/app';
import Auth from '../Auth.svelte';

firebase.initializeApp(firebaseConfig);


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

    h2 {
        color: green;
    }
</style>

    <Modal title="Adopting a frog" on:cancel>
    <div>
        <div class="wrapper">
            <Auth
              useRedirect={true}
              let:user
              let:loggedIn
              let:loginWithGoogle
              let:logout>
              
            {#if !loggedIn}
            <p>You must sign in/register to adopt a frog</p>
             {/if}
              {#if loggedIn}
                <div>
                  <div>
                    <h2>Logged in as {user.email}</h2>
                    <button type="button" class="mt-3" on:click={logout}>Logout</button>
                  </div>
                </div>
              {:else}
                <div class="w-full max-w-xs">
                  <form on:submit|preventDefault>
                    <div class="mt-3">
                      <button type="button" on:click|preventDefault={loginWithGoogle}>
                        Sign In with Google
                      </button>
                    </div>
                  </form>
                </div>
              {/if}
            </Auth>
          </div>
    </div>
    <div slot="footer">
        <CustomButton btntype="submit" >Next steps!</CustomButton>
        <CustomButton btntype="button" on:click="{cancel}">Cancel</CustomButton>
    </div>
    </Modal>
