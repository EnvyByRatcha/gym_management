<script>
  import { onMount } from "svelte";
  import config from "../../config";
  import Swal from "sweetalert2";
  import axios from "axios";
  import Modal from "../../components/Modal.svelte";
  import dayjs from "dayjs";

  let courses = [];
  let trainers = [];
  let courseId = 0;
  let members = [];
  let courseAndMember = {};
  let memberInCourse = [];
  let invoiceUrl = "";

  onMount(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/api/course/list");
      if (res.data.results !== undefined) {
        courses = res.data.results;
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const chooseCourse = async (item) => {
    try {
      courseId = item.id;
      const res = await axios.post(
        config.apiPath + "/api/employeeAndTrainer/filter",
        {
          status: "use",
          level: "trainer",
          gender: "all",
        }
      );

      if (res.data.results !== undefined) {
        trainers = res.data.results;
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const chooseTrainer = async (item) => {
    try {
      const payload = {
        trainerId: item.id,
        courseId: courseId,
      };

      const res = await axios.post(
        config.apiPath + "/api/courseAndTrainer/create",
        payload
      );

      if (res.data.message == "success") {
        Swal.fire({
          title: "Choose trainer",
          text: "Success",
          icon: "success",
          timer: 2000,
        });

        fetchData();
        courseId = 0;
        document.getElementById("modalTrainer_btnClose").click();
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const openModalMember = async (courseId) => {
    try {
      courseAndMember.courseId = courseId;
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

  const clearForm = () => {
    courseAndMember = {};
  };

  const save = async () => {
    try {
      const res = await axios.post(
        config.apiPath + "/api/courseAndMember/create",
        courseAndMember
      );
      if (res.data.message == "success") {
        Swal.fire({
          title: "Add member",
          text: "success",
          icon: "success",
        });

        clearForm();
        document.getElementById("modalCourseAndMember_btnClose").click();
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const chooseMember = (memberId) => {
    courseAndMember.memberId = memberId;
  };

  const openModalMemberInCourse = async (courseId) => {
    try {
      const res = await axios.get(
        config.apiPath + "/api/courseAndMember/list/" + courseId
      );

      if (res.data.results !== undefined) {
        memberInCourse = res.data.results;
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const removeMemberInCourse = async (item) => {
    try {
      const button = await Swal.fire({
        title: "Remove member",
        text: "Remove member in course",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        const res = await axios.delete(
          config.apiPath + "/api/courseAndMember/remove/" + item.id
        );
        openModalMemberInCourse(item.course_id);
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const printInvoice = async (invoiceId) => {
    try {
      const res = await axios.get(
        config.apiPath + "/api/courseAndMember/printInvoice/" + invoiceId
      );
      if (res.data.fileName !== undefined) {
        invoiceUrl = config.apiPath + "/public/" + res.data.fileName;
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
  <div class="card-header">Course And Trainer</div>
  <div class="card-body">
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th class="text-center">Choose Trainer/Customer</th>
          <th>Course</th>
          <th>Detail</th>
          <th class="text-end">Price/Month</th>
          <th class="text-end">Day/Week</th>
          <th class="text-end">Hr/Day</th>
        </tr>
      </thead>
      <tbody>
        {#each courses as item}
          <tr>
            <td class="text-center">
              <button
                class="btn btn-primary"
                on:click={() => chooseCourse(item)}
                data-bs-toggle="modal"
                data-bs-target="#modalTrainer"
              >
                <i class="fa fa-check mr-2"></i>Trainer
              </button>
              <button
                class="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#modalMember"
                on:click={() => openModalMember(item.id)}
                ><i class="fa fa-user mr-2"></i>Customer</button
              >
              <button
                class="btn btn-info"
                data-bs-toggle="modal"
                data-bs-target="#modalMemberInCourse"
                on:click={() => openModalMemberInCourse(item.id)}
                ><i class="fa fa-user mr-2"></i>Member</button
              >
            </td>
            <td
              ><div>{item.name}</div>
              <div class="text-success">
                Trainer : {item.CourseAndTrainer[0]?.Trainer.name ?? "-"}
              </div></td
            >
            <td>{item.detail}</td>
            <td class="text-end">{item.price.toLocaleString("TH-th")}</td>
            <td class="text-end">{item.dayPerWeek}</td>
            <td class="text-end">{item.hourPerDay}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<Modal id="modalTrainer" title="Choose trainer">
  <table class="table table-bordered table-striped mt-3">
    <thead>
      <tr>
        <th width="120px">Choose</th>
        <th>Name</th>
        <th>Gender</th>
      </tr>
    </thead>
    <tbody>
      {#each trainers as item}
        <tr>
          <td class="text-end"
            ><button
              class="btn btn-primary"
              on:click={() => chooseTrainer(item)}
              ><i class="fa fa-check mr-2"></i>Choose</button
            ></td
          >
          <td>{item.name}</td>
          <td>{item.gender}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</Modal>

<Modal id="modalMember" title="Choose customer">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th width="120px">Choose</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      {#each members as item}
        <tr>
          <td>
            <button
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalCourseAndMember"
              on:click={() => chooseMember(item.id)}
            >
              <i class="fa fa-check mr-2"></i>Choose
            </button>
          </td>
          <td>{item.name}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</Modal>

<Modal id="modalCourseAndMember" title="Detail">
  <div>
    <div>Qty</div>
    <input class="form-control" bind:value={courseAndMember.qty} />
  </div>
  <div class="mt-3">
    <div>Begin</div>
    <input
      class="form-control"
      type="date"
      bind:value={courseAndMember.createDate}
    />
  </div>
  <div class="mt-3">
    <div>Final</div>
    <input
      class="form-control"
      type="date"
      bind:value={courseAndMember.expireDate}
    />
  </div>
  <div class="mt-3">
    <div>remark</div>
    <input class="form-control" bind:value={courseAndMember.remark} />
  </div>
  <div class="mt-3">
    <button class="btn btn-primary" on:click={() => save()}>
      <i class="fa fa-check mr-2"></i>Save
    </button>
  </div>
</Modal>

<Modal id="modalMemberInCourse" title="Member in Course">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Tel.</th>
        <th class="text-end">Month</th>
        <th>FirstD</th>
        <th>LastD</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each memberInCourse as item}
        <tr>
          <td>{item.Member.name}</td>
          <td>{item.Member.phone}</td>
          <td class="text-end">{item.qty}</td>
          <td>{dayjs(item.createDate).format("DD/MM/YYYY")}</td>
          <td>{dayjs(item.expireDate).format("DD/MM/YYYY")}</td>
          <td class="text-center">
            <button
              class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalPrintInvoice"
              on:click={() => printInvoice(item.id)}
            >
              <i class="fa fa-print"></i>
            </button>
            <button
              class="btn btn-danger"
              on:click={() => removeMemberInCourse(item)}
            >
              <i class="fa fa-times"></i>
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</Modal>

<Modal id="modalPrintInvoice" title="Print Invoice">
  <iframe title="test" src={invoiceUrl} width="100%" height="700px"></iframe>
</Modal>
