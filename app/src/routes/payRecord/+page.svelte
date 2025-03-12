<script>
  import Swal from "sweetalert2";
  import Modal from "../../components/Modal.svelte";
  import axios from "axios";
  import config from "../../config";
  import { onMount } from "svelte";
  import dayjs from "dayjs";

  let payRecord = {};
  let payRecords = [];

  onMount(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/api/payRecord/list");
      if (res.data.results !== undefined) {
        payRecords = res.data.results;
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
    payRecord = {};
  };

  const save = async () => {
    try {
      payRecord.qty = parseInt(payRecord.qty);
      payRecord.price = parseInt(payRecord.price);
      payRecord.payDate = new Date(payRecord.payDate);
      payRecord.remark = payRecord.remark == undefined ? "" : payRecord.remark;

      let res;
      if (payRecord.id !== undefined) {
        payRecord.id = parseInt(payRecord.id);
        res = await axios.put(
          config.apiPath + "/api/payRecord/update/",
          payRecord
        );
      } else {
        res = await axios.post(
          config.apiPath + "/api/payRecord/create",
          payRecord
        );
      }

      if (res.data.message !== undefined) {
        Swal.fire({
          title: payRecord.id !== undefined ? "Update Record" : "Add Record",
          text: "success",
          icon: "success",
          timer: 2000,
        });
        fetchData();
        document.getElementById("modalPayRecord_btnClose").click();
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const remove = async (id) => {
    try {
      const button = await Swal.fire({
        title: "remove PayRecord?",
        text: "Confirm remove?",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        const res = await axios.delete(
          config.apiPath + "/api/payRecord/remove/" + id
        );

        if (res.data.message == "success") {
          Swal.fire({
            title: "Remove Record",
            text: "success",
            icon: "success",
            timer: 2000,
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
</script>

<div class="card mt-3">
  <div class="card-body">Pay Record</div>
  <div class="card-body">
    <button
      class="btn btn-primary"
      on:click={() => clearForm()}
      data-bs-toggle="modal"
      data-bs-target="#modalPayRecord"
    >
      <i class="fa fa-plus mr-2"></i>Add record
    </button>
    <table class="table table-bordered table-striped mt-3">
      <thead>
        <tr>
          <th>Order</th>
          <th>qty</th>
          <th>price</th>
          <th>Total</th>
          <th>Date</th>
          <th>Remark</th>
          <th width="120px"></th>
        </tr>
      </thead>
      <tbody>
        {#each payRecords as item}
          <tr>
            <td>{item.name}</td>
            <td class="text-end">{item.qty}</td>
            <td class="text-end">{item.price.toLocaleString("th-TH")}</td>
            <td class="text-end"
              >{(item.qty * item.price).toLocaleString("th-TH")}</td
            >
            <td>{dayjs(item.payDate).format("DD/MM/YYYY")}</td>
            <td>{item.remark}</td>
            <td class="text-center">
              <button
                class="btn btn-primary"
                on:click={() => {
                  payRecord = item;
                  payRecord.payDate = dayjs(new Date(payRecord.payDate)).format(
                    "YYYY-MM-DD"
                  );
                }}
                data-bs-toggle="modal"
                data-bs-target="#modalPayRecord"
                ><i class="fa fa-pencil"></i></button
              >
              <button class="btn btn-danger" on:click={() => remove(item.id)}
                ><i class="fa fa-times"></i></button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<Modal id="modalPayRecord" title="Add Pay Record">
  <div>
    <div>Name</div>
    <input class="form-control" bind:value={payRecord.name} />
  </div>
  <div class="mt-3">
    <div>qty</div>
    <input class="form-control" bind:value={payRecord.qty} />
  </div>
  <div class="mt-3">
    <div>price</div>
    <input class="form-control" bind:value={payRecord.price} />
  </div>
  <div class="mt-3">
    <div>payDate</div>
    <input class="form-control" type="date" bind:value={payRecord.payDate} />
  </div>
  <div class="mt-3">
    <div>remark</div>
    <input class="form-control" bind:value={payRecord.remark} />
  </div>
  <div class="mt-3">
    <button class="btn btn-primary" on:click={() => save()}
      ><i class="fa fa-check"></i>save</button
    >
  </div>
</Modal>
