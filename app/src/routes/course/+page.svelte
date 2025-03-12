<script>
  import { onMount } from "svelte";
  import Modal from "../../components/Modal.svelte";
  import Swal from "sweetalert2";
  import axios from "axios";
  import config from "../../config";

  let courseList = [];
  let course = {
    price: 0,
    dayPerWeek: 0,
    hourPerDay: 0,
  };
  let id = 0;

  onMount(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/api/course/list");

      if (res.data.results !== undefined) {
        courseList = res.data.results;
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
    course.name = "";
    course.price = 0;
    course.detail = "";
    course.remark = "";
    course.dayPerWeek = 0;
    course.hourPerDay = 0;
  };

  const save = async () => {
    try {
      let res;

      if (id > 0) {
        res = await axios.put(
          config.apiPath + "/api/course/update/" + id,
          course
        );
      } else {
        res = await axios.post(config.apiPath + "/api/course/create", course);
      }

      if (res.data.message == "success") {
        Swal.fire({
          title: "Add course",
          text: "success",
          icon: "success",
          timer: 2000,
        });

        id = 0;
        document.getElementById("modalCourse_btnClose").click();
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

  const remove = async (item) => {
    try {
      const button = await Swal.fire({
        title: "remove course",
        text: "Confirm remove??",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        const res = await axios.put(
          config.apiPath + "/api/course/remove/" + item.id
        );

        if (res.data.message == "success") {
          Swal.fire({
            title: "Remove course",
            text: "remove success",
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

  const chooseItem = (item) => {
    id = item.id;
    course = item;
  };
</script>

<div class="card mt-3">
  <div class="card-header">Course</div>
  <div class="card-body">
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#modalCourse"
      on:click={() => clearForm()}
      ><i class="fa fa-plus mr-2"></i>Add course</button
    >

    <table class="table table-bordered table-striped mt-3">
      <thead>
        <tr>
          <th>Name</th>
          <th>Detail</th>
          <th class="text-end">Price</th>
          <th class="text-end">Day/Week</th>
          <th class="text-end">Hour/Day</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each courseList as item}
          <tr>
            <td>
              <div>
                {item.name}
                {#if item.remark != ""}
                  <div class="text-danger">{item.remark}</div>
                {/if}
              </div>
            </td>
            <td>{item.detail}</td>
            <td class="text-end">{item.price.toLocaleString("TH-th")}</td>
            <td class="text-end">{item.dayPerWeek}</td>
            <td class="text-end">{item.hourPerDay}</td>
            <td class="text-center">
              {#if item.status != "delete"}
                <button
                  class="btn btn-primary"
                  on:click={() => chooseItem(item)}
                  data-bs-toggle="modal"
                  data-bs-target="#modalCourse"
                  ><i class="fa fa-pencil"></i></button
                >
                <button class="btn btn-danger" on:click={() => remove(item)}
                  ><i class="fa fa-times"></i></button
                >
              {:else}
                <span class="text-danger">Cancled</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<Modal id="modalCourse" title="Course">
  <div>
    <div>Name</div>
    <input class="form-control" bind:value={course.name} />
  </div>
  <div class="mt-3">
    <div>price</div>
    <input class="form-control" bind:value={course.price} />
  </div>
  <div class="mt-3">
    <div>detail</div>
    <input class="form-control" bind:value={course.detail} />
  </div>
  <div class="mt-3">
    <div>remark</div>
    <input class="form-control" bind:value={course.remark} />
  </div>
  <div class="mt-3">
    <div>Day/Week</div>
    <input class="form-control" bind:value={course.dayPerWeek} />
  </div>
  <div class="mt-3">
    <div>Hr/Day</div>
    <input class="form-control" bind:value={course.hourPerDay} />
  </div>
  <div class="mt-3">
    <button class="btn btn-primary" on:click={() => save()}
      ><i class="fa fa-plus mr-2"></i>Save</button
    >
  </div>
</Modal>
