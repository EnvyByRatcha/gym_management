<script>
  import Modal from "../../components/Modal.svelte";
  import Swal from "sweetalert2";
  import axios from "axios";
  import config from "../../config";
  import { onMount } from "svelte";
  import dayjs from "dayjs";

  let id = 0;
  let name = "";
  let gender = "male";
  let genderList = [
    { key: "male", value: "ชาย" },
    {
      key: "female",
      value: "หญิง",
    },
  ];
  let phone = "";
  let registerDate = new Date();
  let expireDate = new Date();
  let member = [];

  let money = 0;
  let membershipExpireDate = null;
  let remark = "";

  let membership = [];
  let membership_id = 0;

  const save = async () => {
    try {
      const payload = {
        name: name,
        phone: phone,
        gender: gender,
        registerDate: registerDate,
        expireDate: expireDate,
      };

      let message = "";
      if (id > 0) {
        const res = await axios.put(
          config.apiPath + "/api/member/update/" + id,
          payload
        );
        message = res.data.message;
      } else {
        const res = await axios.post(
          config.apiPath + "/api/member/create",
          payload
        );
        message = res.data.message;
      }

      if (message === "success") {
        id = 0;
        Swal.fire({
          title: "save",
          text: "saved",
          icon: "success",
          timer: 2000,
        });

        fetchData();
        document.getElementById("modalMember_btnClose").click();
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: "error",
        icon: "error",
      });
    }
  };

  onMount(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/api/member/list");

      if (res.data.results !== undefined) {
        member = res.data.results;
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: "e.message",
        icon: "error",
      });
    }
  };

  const displayGender = (gender) => {
    for (let i = 0; i < genderList.length; i++) {
      if (genderList[i].key == gender) {
        return genderList[i].value;
      }
    }
  };

  const remove = async (item) => {
    try {
      const button = await Swal.fire({
        title: "ลบข้อมูล",
        text: "ยินยันการลบใช่หรือไม่",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        await axios.delete(config.apiPath + "/api/member/remove/" + item.id);
        fetchData();
        document.getElementById("modalMember_btnClose").click();
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const edit = (item) => {
    name = item.name;
    phone = item.phone;
    gender = item.gender;
    registerDate = dayjs(item.registerDate).format("YYYY-MM-DD");
    expireDate = dayjs(item.expireDate).format("YYYY-MM-DD");
    id = item.id;
  };

  const chooseMember = (item) => {
    name = item.Member.name;
    membershipExpireDate = dayjs(new Date()).format("YYYY-MM-DD");
    remark = item.remark;
    money = item.money;
    membership_id = item.id;
    id = item.member_id;
  };

  const membershipSave = async () => {
    try {
      const payload = {
        money: parseInt(money),
        member_id: id,
        expireDate: membershipExpireDate,
        remark: remark,
      };

      if (membership_id > 0) {
        await axios.post(
          config.apiPath + "/api/member/membershipUpdate/" + membership_id,
          payload
        );
      } else {
        await axios.post(config.apiPath + "/api/member/membership", payload);
      }

      membership_id = 0;
      fetchData();
      document.getElementById("modalMembership_btnClose").click();
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const showHistory = async (item) => {
    try {
      const res = await axios.get(
        config.apiPath + "/api/member/membershipList/" + item.id
      );

      if (res.data.results !== undefined) {
        membership = res.data.results;
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const removeHistory = async (item) => {
    try {
      const button = await Swal.fire({
        title: "ลบประวัติการต่ออายุสมาชิก",
        text: "ยืนยันการลบประวัติ",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        const res = await axios.delete(
          config.apiPath + "/api/member/removeHistory/" + item.id
        );

        if (res.data.message === "success") {
          showHistory({ id: item.member_id });
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

<div class="card">
  <div class="card-header">Member</div>
  <div class="card-body">
    <button
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#modalMember"
    >
      <i class="fa fa-plus mr-2"></i>Add Member
    </button>
    <table class="table table-bordered table-striped mt-3">
      <thead>
        <tr>
          <th>ชื่อสมาชิก</th>
          <th>เพศ</th>
          <th>เบอร์โทร </th>
          <th>วันที่ลงทะเบียน</th>
          <th>วันสิ้นสุดอายุสมาชิก</th>
          <th width="200px"></th>
        </tr>
      </thead>
      <tbody>
        {#each member as item}
          <tr>
            <td>{item.name}</td>
            <td>{displayGender(item.gender)}</td>
            <td>{item.phone}</td>
            <td>{dayjs(item.registerDate).format("DD/MM/YYYY")}</td>
            <td>{dayjs(item.expireDate).format("DD/MM/YYYY")}</td>
            <td class="text-center">
              <button
                class="btn btn-secondary"
                data-bs-toggle="modal"
                data-bs-target="#modalHistory"
                on:click={() => showHistory(item)}
                ><i class="fa fa-file-alt"></i></button
              >
              <button
                class="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#modalMembership"
                on:click={() => chooseMember(item)}
              >
                <i class="fa fa-plus"></i>
              </button>
              <button
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#modalMember"
                on:click={() => edit(item)}><i class="fa fa-pencil"></i></button
              >
              <button class="btn btn-danger" on:click={() => remove(item)}
                ><i class="fa fa-times"></i></button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<Modal id="modalHistory" title="ประวัติการต่ออายุสมาชิก">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th>วันที่ต่ออายุ</th>
        <th>หมายเหตุ</th>
        <th class="text-end">ยอดเงิน</th>
        <th width="120px"></th>
      </tr>
    </thead>
    <tbody>
      {#each membership as item}<tr>
          <td>{dayjs(item.pay_date).format("YYYY-MM-DD")}</td>
          <td>{item.remark}</td>
          <td class="text-end">{item.money}</td>
          <td class="text-center"
            ><button
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalMembership"
              on:click={() => chooseMember(item)}
              ><i class="fa fa-pencil"></i></button
            >
            <button class="btn btn-danger" on:click={() => removeHistory(item)}
              ><i class="fa fa-times"></i></button
            ></td
          >
        </tr>{/each}
    </tbody>
  </table>
</Modal>

<Modal id="modalMembership" title="ต่ออายุสมาชิก">
  <div>
    <div>สมาชิก</div>
    <input class="form-control" bind:value={name} disabled />
  </div>
  <div class="mt-3">
    <div>ยอดเงิน</div>
    <input class="form-control" bind:value={money} />
  </div>
  <div class="mt-3">
    <div>วันสิ้นสุดอายุสมาชิก</div>
    <input class="form-control" bind:value={membershipExpireDate} type="date" />
  </div>
  <div class="mt-3">
    <div>หมายเหตุ</div>
    <input class="form-control" bind:value={remark} />
  </div>
  <div class="mt-3">
    <button class="btn btn-primary" on:click={() => membershipSave()}
      ><i class="fa fa-plus me-2"></i>บันทึก</button
    >
  </div>
</Modal>

<Modal id="modalMember" title="Member">
  <div>
    <div>ชื่อสมาชิก</div>
    <input class="form-control" bind:value={name} />
  </div>
  <div class="mt-3">
    <div>เพศ</div>
    <input class="form-control" bind:value={gender} />
  </div>
  <div class="mt-3">
    <div>เบอร์โทร</div>
    <input class="form-control" bind:value={phone} />
  </div>
  <div class="mt-3">
    <div>วันที่ลงทะเบียน</div>
    <input class="form-control" type="date" bind:value={registerDate} />
  </div>
  <div class="mt-3">
    <div>วันสิ้นสุดอายุสมาชิก</div>
    <input class="form-control" type="date" bind:value={expireDate} />
  </div>
  <button class="btn btn-primary mt-3" on:click={() => save()}>
    <i class="fa fa-check mr-2"></i>บันทึก
  </button>
</Modal>
