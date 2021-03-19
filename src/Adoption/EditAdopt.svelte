<script>
let title = '';
let titleValid = false;
let subtitle = '';
let description = '';
let imageUrl = '';
let urlValid = false;
let address = '';
let contact = '';

let overallValid = false;
$:overallValid = titleValid && descriptionValid && urlValid

import { fade } from 'svelte/transition';
import { createEventDispatcher } from "svelte";
import TextInput from "../UI/TextInput.svelte";
import CustomButton from "../UI/CustomButton.svelte";
import Modal from "../UI/Modal.svelte";
import { isEmpty } from "../helpers/validation.js"
import { validateUrl } from "../helpers/validation.js";


const dispatch = createEventDispatcher();


$:titleValid = !isEmpty(title);
$:descriptionValid = !isEmpty(description)
$:urlValid = validateUrl(imageUrl);

function submitForm(){
    dispatch('adoption-submit', {
        title: title,
        subtitle: subtitle,
        description: description,
        imageUrl: imageUrl,
        address: address,
        contact: contact,
    })}

function cancel() {
      dispatch('cancel');
  }
    
</script>

<style>
    form {
        width: 100%;
    }
</style>

    <Modal title="Re-home Form" on:cancel>
    <form on:submit|preventDefault="{submitForm}" in:fade>
        <TextInput 
        Id="title" 
        label="Name" 
        controlType=""
        rows=""
        value={title} 
        valid = {titleValid}
        validityMessage="Enter your frog's name"
        on:input={event => (title = event.target.value)}/>

        <TextInput 
        Id="subtitle" 
        label="Species" 
        controlType=""
        rows=""
        value={subtitle} 
        on:input={event => (subtitle = event.target.value)}/>

        <TextInput 
        Id="description" 
        label="Description" 
        controlType="textarea"
        rows="4"
        valid={descriptionValid}
        value={description} 
        on:input={event => (description = event.target.value)}/>


        <TextInput 
        Id="imageUrL" 
        label="ImageUrl"
        controlType=""
        rows="" 
        valid={urlValid}
        validityMessage="Must enter valid URL"
        value={imageUrl} 
        on:input={event => (imageUrl = event.target.value)}/>

        

        <TextInput 
        Id="address" 
        label="Address"
        controlType=""
        rows="" 
        value={address} 
        on:input={event => (address = event.target.value)}/>

        <TextInput 
        Id="contact" 
        label="E-mail" 
        controlType=""
        rows=""
        value={contact} 
        on:input={event => (contact = event.target.value)}/>

        <a target="blank" href="https://unsplash.com/s/photos/frogs">Browse images</a>
    </form>
    <div slot="footer">
        <CustomButton btntype="submit" disabled={!overallValid} on:click="{submitForm}">Post Advert</CustomButton>
        <CustomButton btntype="button" on:click="{cancel}">Cancel</CustomButton>
    </div>
    </Modal>
