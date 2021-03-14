<script>
    export let controlType = null;
    export let Id;
    export let label;
    export let rows = null;
    export let value;
    export let valid;
    export let validityMessage;

    let touched = false;


</script>

<style>
    input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: none;
  border-bottom: 2px solid #ccc;
  border-radius: 3px 3px 0 0;
  background: white;
  padding: 0.15rem 0.25rem;
  transition: border-color 0.1s ease-out;
}

input:focus,
textarea:focus {
  border-color: #e40763;
  outline: none;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  width: 100%;
}

.form-control {
  padding: 0.5rem 0;
  width: 100%;
  margin: 0.25rem 0;
}

.invalid {
  border-color: #e40763;
  background-color: rgb(242, 209, 209);
}

.error-message {
  color: #e40763;
  margin: 0.25rem 0;
}

</style>



<div class="form-control">
    <label for="{Id}">{label}</label>
{#if controlType === "textarea"}
    <!-- on:input forwards even to parent -->
    <!-- adds class to textarea if not valid -->
    <!-- On blur fires event when user clicks and leaves input -->
    <textarea class:invalid="{!valid && touched}" {rows} {Id} {value} on:input on:blur={()=> touched = true}/>
{:else}
    <input class:invalid="{!valid && touched}" type="text" {Id} {value} on:input/>
{/if}
{#if validityMessage && !valid}
<p class="error-message">{validityMessage}</p>
{/if}
</div>