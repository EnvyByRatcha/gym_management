<script>
  import axios from "axios";
  import Swal from "sweetalert2";
  import { onMount } from "svelte";
  import config from "../../config";
  import { quartIn } from "svelte/easing";
  import Modal from "../../components/Modal.svelte";

  let id = 0;
  let name = "";
  let price = 0;
  let qty = 1;
  let remark = "";
  let devices = [];
  let sumAllRow = 0;

  onMount(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/api/device/list");

      if (res.data.results !== undefined) {
        devices = res.data.results;

        let sum = 0;
        for (let i = 0; i < devices.length; i++) {
          let item = devices[i];
          sum += parseInt(item.price) * parseInt(item.qty);
        }
        sumAllRow = sum;
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const save = async () => {
    try {
      const payload = {
        name: name,
        price: parseInt(price),
        qty: parseInt(qty),
        remark: remark,
      };

      let res;

      if (id > 0) {
        res = await axios.put(
          config.apiPath + "/api/device/update/" + id,
          payload
        );
      } else {
        res = await axios.post(config.apiPath + "/api/device/create", payload);
      }

      if (res.data.message === "success") {
        Swal.fire({
          title: "Add device",
          text: "Success",
          icon: "success",
        });
        id = 0;
        document.getElementById("modalDevice_btnClose").click();
        fetchData();
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const clearForm = () => {
    name = "";
    price = "";
    qty = 1;
    remark = "";
  };

  const remove = async (item) => {
    try {
      const button = await Swal.fire({
        title: "Remove device",
        text: "Confirm remove device",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        const res = await axios.delete(
          config.apiPath + "/api/device/remove/" + item.id
        );
        if (res.data.message === "success") {
          Swal.fire({
            title: "Remove device",
            text: "Remove success",
            icon: "success",
          });

          fetchData();
        }
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const chooseDevice = (item) => {
    id = item.id;
    name = item.name;
    price = item.price;
    qty = item.qty;
    remark = item.remark;
  };
</script>

<div class="card mt-3">
  <div class="card-header">Device</div>
  <div class="card-body">
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#modalDevice"
      on:click={() => clearForm()}
    >
      <i class="fa fa-plus me-2"></i>Add device
    </button>

    <table class="mt-3 table table-bordered table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th class="text-end">Price</th>
          <th class="text-end">Qty</th>
          <th class="text-end">Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each devices as item}
          <tr>
            <td>{item.name}</td>
            <td class="text-end">{item.price.toLocaleString("TH-th")}</td>
            <td class="text-end">{item.qty}</td>
            <td class="text-end"
              >{(item.price * item.qty).toLocaleString("Th-th")}</td
            >
            <td class="text-center">
              <button
                class="btn btn-primary"
                on:click={() => chooseDevice(item)}
                data-bs-toggle="modal"
                data-bs-target="#modalDevice"
                ><i class="fa fa-pencil"></i></button
              >
              <button class="btn btn-danger" on:click={() => remove(item)}
                ><i class="fa fa-times"></i></button
              >
            </td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Total</td>
          <td class="text-end">{sumAllRow.toLocaleString("TH-th")}</td>
          <td class="text-end"></td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>

<Modal id="modalDevice" title="Add device">
  <div>
    <div>Name</div>
    <input class="form-control" bind:value={name} />
  </div>
  <div class="mt-3">
    <div>price</div>
    <input class="form-control" bind:value={price} />
  </div>
  <div class="mt-3">
    <div>qty</div>
    <input class="form-control" bind:value={qty} />
  </div>
  <div class="mt-3">
    <div>remark</div>
    <input class="form-control" bind:value={remark} />
  </div>
  <div class="mt-3">
    <button class="btn btn-primary" on:click={() => save()}>
      <i class="fa fa-check me-2"></i>Save
    </button>
  </div>
</Modal>
