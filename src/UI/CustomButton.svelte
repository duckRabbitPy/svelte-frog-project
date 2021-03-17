<script>
    export let btntype;
    export let stateColour = null;
    export let disabled = false;
      
</script>

<style>

  button {
  /* work around styling to get fix darkmode change, consider using navbar instead */
 margin-top: 1rem;
  }
    button,
a {
  font: inherit;
  border: 1px solid #1c6d2c;
  background: #1c6d2c;
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 5px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.26);
  cursor: pointer;
  text-decoration: none;
}

button:focus {
  outline: none;
}

button:hover,
button:active {
  background: #9a476b;
  border-color: #9a476b;
  box-shadow: 1px 1px 8px rgba(77, 51, 51, 0.26);
}

button:disabled,
button:disabled:hover,
button:disabled:active {
  background: #ccc;
  border-color: #ccc;
  color: #959595;
  box-shadow: none;
  cursor: not-allowed;
}

.success {
  background: #1c6d2c;
  border-color:#1c6d2c;
}

.success:hover,
.success:active {
  background: #1ac745;
  border-color: #1ac745;
}

.outline {
  background: transparent;
  color: #cf0056;
  box-shadow: none;
}

.outline:hover,
.outline:active {
  background: #ffc7de;
  box-shadow: none;
}

.outline:disabled,
.outline:disabled:hover,
.outline:disabled:active {
  background: transparent;
  color: #ccc;
}

.outline.success {
  border-color: #01a129;
  color: #01a129;
}

.outline.success:hover,
.outline.success:active {
  background: #c2ffd1;
}

.return {
  border-color: #fffb84;
  color: #fffb84;
}

.secondary-light {
  border-color: #324A5E;
  background-color: #324A5E;
}

.secondary-dark {
  border-color: #4CDBC3;
  background-color: #4CDBC3;
}

</style>

<!-- remember to include on:click in child components to allow custom event propagation -->
<button class="{stateColour}" type="{btntype}" disabled={disabled} on:click><slot/></button>