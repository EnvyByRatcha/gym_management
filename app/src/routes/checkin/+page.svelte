<script>
  import { onMount } from "svelte";
  import Modal from "../../components/Modal.svelte";
  import Swal from "sweetalert2";
  import axios from "axios";
  import config from "../../config";
  import dayjs from "dayjs";

  let id;
  let name;
  let members = [];
  let checkIns = [];

  onMount(() => {
    fetchData();
    fetchCheckIn();
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/api/member/list");

      if (res.data.results !== undefined) {
        members = res.data.results;
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const fetchCheckIn = async () => {
    try {
      const res = await axios.get(config.apiPath + "/api/checkin/list");

      if (res.data.results !== undefined) {
        checkIns = res.data.results;
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const chooseMember = (item) => {
    name = item.name;
    id = item.id;
    document.getElementById("modalMember_btnClose").click();
  };

  const save = async () => {
    try {
      const payload = {
        member_id: id,
      };

      const button = await Swal.fire({
        title: "Access confirm",
        text: "Access " + name + " to GYM?",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        await axios.post(config.apiPath + "/api/checkin/create", payload);
        Swal.fire({
          title: "Access success",
          text: "Success",
          icon: "success",
          timer: 2000,
        });

        fetchCheckIn();
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const remove = async (item) => {
    try {
      const button = await Swal.fire({
        title: "remove checkin",
        text: "Confirm remove?",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        const res = await axios.delete(
          config.apiPath + "/api/checkin/remove/" + item.id
        );
        if (res.data.message === "success") {
          Swal.fire({
            title: "Remove",
            text: "Remove success",
            icon: "success",
            timer: 2000,
          });
        }
        fetchCheckIn();
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
  <div class="card-header">Check in</div>
  <div class="card-body">
    <div class="row">
      <div class="col-8">
        <div>Member</div>
        <div class="input-group mt-2">
          <input class="form-control" disabled bind:value={name} />
          <span class="input-group-append">
            <button
              class="btn btn-primary me-2"
              data-bs-toggle="modal"
              data-bs-target="#modalMember"
            >
              <i class="fa fa-search"></i>
            </button>
            <button class="btn btn-success" on:click={() => save()}>
              <i class="fa fa-check me-2"></i>save
            </button>
          </span>
        </div>
      </div>
    </div>
    <table class="table table-bordered table-striped mt-3">
      <thead>
        <tr>
          <th>Member</th>
          <th width="240px">Date</th>
          <th width="60px"></th>
        </tr>
      </thead>
      <tbody>
        {#each checkIns as item}
          <tr>
            <td>{item.Member.name}</td>
            <td>{item.checkin_date}</td>
            <td class="text-center">
              <button class="btn btn-danger" on:click={() => remove(item)}>
                <i class="fa fa-times"></i>
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<Modal id="modalMember" title="Choose Member">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th>Choose</th>
        <th>Name</th>
        <th>Tel.</th>
        <th>Expire Date</th>
      </tr>
    </thead>
    <tbody>
      {#each members as item}
        <tr>
          <td class="text-center"
            ><button
              class="btn btn-primary"
              on:click={() => chooseMember(item)}
            >
              <i class="fa fa-user"></i>
            </button></td
          >
          <td>{item.name}</td>
          <td>{item.phone}</td>
          <td>{dayjs(item.expireDate).format("YYYY-MM-DD")}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</Modal>
