
///      JS of bootstrap , Puspose : when any client fill the add listing form or edit lisiting form then the required keyword's styling will be accourding the bootstrap .  e.g if we do not enter titile then it will show a message below input that enter the title first.

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()