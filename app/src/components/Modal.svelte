<script>
  export let id;
  export let title;
</script>

<div
  class="modal fade"
  {id}
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header bg-dark">
        <h1 class="modal-title fs-5" id="exampleModalLabel">{title}</h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          id={id + "_btnClose"}
        ></button>
      </div>
      <div class="modal-body"><slot></slot></div>
    </div>
  </div>
</div>
