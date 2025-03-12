<script>
  import Swal from "sweetalert2";
  import Modal from "../../components/Modal.svelte";
  import axios from "axios";
  import config from "../../config";
  import { onMount } from "svelte";

  let id = 0;
  let name = "";
  let gender = "male";
  let phone = "";
  let address = "";
  let salary = "";
  let level = "employee";
  let employeeAndTrainer = [];
  let filter = {};
  let username = "";
  let password = "";

  onMount(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(
        config.apiPath + "/api/employeeAndTrainer/list"
      );

      if (res.data.results !== undefined) {
        employeeAndTrainer = res.data.results;
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
        gender: gender,
        phone: phone,
        address: address,
        salary: parseInt(salary),
        level: level,
        username: username,
        password: password,
      };

      let res;

      if (id > 0) {
        res = await axios.put(
          config.apiPath + "/api/employeeAndTrainer/update/" + id,
          payload
        );
      } else {
        res = await axios.post(
          config.apiPath + "/api/employeeAndTrainer/create",
          payload
        );
      }

      if (res.data.message === "success") {
        Swal.fire({
          title: "Add employee",
          text: "success",
          icon: "success",
          timer: 2000,
        });

        id = 0;
        document.getElementById("modalEmployee_btnClose").click();
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
    id = 0;
    name = "";
    gender = "male";
    phone = "";
    address = "";
    salary = "";
    level = "employee";
    username = "";
    password = "";
  };

  const labelGender = (item) => {
    if (item == "male") {
      return "ชาย";
    } else {
      return "หญิง";
    }
  };

  const labelLevel = (item) => {
    if (item == "employee") {
      return "พนักงาน";
    } else {
      return "เทรนเนอร์";
    }
  };

  const labelStatus = (item) => {
    if (item == "use") {
      return "ปกติ";
    } else {
      return "ไม่ได้ทำงาน";
    }
  };

  const remove = async (item) => {
    try {
      const button = await Swal.fire({
        title: "Remove Employee",
        text: "Confirm remove?",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        const res = await axios.put(
          config.apiPath + "/api/employeeAndTrainer/remove/" + item.id
        );

        if (res.data.message == "success") {
          Swal.fire({
            title: "Remove",
            text: "Remove success",
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
    name = item.name;
    gender = item.gender;
    phone = item.phone;
    address = item.address;
    salary = item.salary;
    level = item.level;
    username = item.username;
    password = item.password;
  };

  const handleFilter = async () => {
    try {
      const res = await axios.post(
        config.apiPath + "/api/employeeAndTrainer/filter",
        filter
      );

      if (res.data.results !== undefined) {
        employeeAndTrainer = res.data.results;
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
  <div class="card-header">Trainer</div>
  <div class="card-body">
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#modalEmployee"
      on:click={() => clearForm()}
      ><i class="fa fa-plus mr-2"></i>Add Employee</button
    >

    <div class="alert alert-info mt-3">
      <div class="row">
        <div class="col-3">
          <select class="form-control" bind:value={filter.gender}>
            <option value="all">--All Gender--</option>
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
          </select>
        </div>
        <div class="col-3">
          <select class="form-control" bind:value={filter.level}>
            <option value="all">--All Level--</option>
            <option value="employee">พนักงาน</option>
            <option value="trainer">เทรนเนอร์</option>
          </select>
        </div>
        <div class="col-3">
          <select class="form-control" bind:value={filter.status}>
            <option value="all">--All Status--</option>
            <option value="use">ปกติ</option>
            <option value="delete">ไม่ได้ทำงาน</option>
          </select>
        </div>
        <div class="col-3">
          <button class="btn btn-primary" on:click={() => handleFilter()}
            ><i class="fa fa-search mr-2"></i>แสดงข้อมูล</button
          >
        </div>
      </div>
    </div>

    <table class="table table-bordered table-striped mt-3">
      <thead>
        <tr>
          <th>Name</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Level</th>
          <th class="text-end">Salary</th>
          <th class="text-center">Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each employeeAndTrainer as item}
          <tr>
            <td>{item.name}</td>
            <td>{labelGender(item.gender)}</td>
            <td>{item.phone}</td>
            <td>{item.address}</td>
            <td>{labelLevel(item.level)}</td>
            <td class="text-end">{item.salary.toLocaleString("TH-th")}</td>
            <td class="text-center">{labelStatus(item.status)}</td>
            <td class="text-center">
              {#if item.status == "use"}
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalEmployee"
                  on:click={() => chooseItem(item)}
                  ><i class="fa fa-pencil"></i></button
                >
                <button class="btn btn-danger" on:click={() => remove(item)}
                  ><i class="fa fa-times"></i></button
                >
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<Modal id="modalEmployee" title="Employee info">
  <div>
    <div>Name</div>
    <input class="form-control" bind:value={name} />
  </div>
  <div class="mt-3">
    <div>Gender</div>
    <input type="radio" value="male" name="gender" bind:group={gender} />Male
    <input
      type="radio"
      value="female"
      name="gender"
      bind:group={gender}
    />Female
  </div>
  <div class="mt-3">
    <div>Phone</div>
    <input class="form-control" bind:value={phone} />
  </div>
  <div class="mt-3">
    <div>Address</div>
    <input class="form-control" bind:value={address} />
  </div>
  <div class="mt-3">
    <div>Salary</div>
    <input class="form-control" bind:value={salary} />
  </div>
  <div class="mt-3">
    <div>Level</div>
    <input
      type="radio"
      value="employee"
      name="level"
      bind:group={level}
    />Employee
    <input
      type="radio"
      value="trainer"
      name="level"
      bind:group={level}
    />Trainer
  </div>
  <div class="mt-3">
    <div>Username</div>
    <input class="form-control" bind:value={username} />
  </div>
  <div class="mt-3">
    <div>password</div>
    <input class="form-control" bind:value={password} />
  </div>
  <div class="mt-3">
    <button class="btn btn-primary" on:click={() => save()}
      ><i class="fa fa-check mr-2"></i>Save</button
    >
  </div>
</Modal>
