<script>
  import axios from "axios";
  import dayjs from "dayjs";
  import Swal from "sweetalert2";
  import config from "../../config";

  let fromDate = dayjs(new Date()).format("YYYY-MM-DD");
  let toDate = dayjs(new Date()).format("YYYY-MM-DD");

  let incomeMemberShips = [];
  let incomeCourseAndMember = [];
  let totalIncome = 0;
  let totalPay = 0;
  let totalProfit = 0;
  let payRecords = [];

  const handleSelect = async () => {
    try {
      const payload = {
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
      };
      const res = await axios.post(
        config.apiPath + "/api/reportProfit/income",
        payload
      );

      if (res.data.members !== undefined) {
        incomeMemberShips = res.data.members;
        incomeCourseAndMember = res.data.courseAndMembers;

        totalIncome = 0;

        for (let i = 0; i < incomeCourseAndMember.length; i++) {
          let item = incomeCourseAndMember[i];
          totalIncome += parseInt(item.qty) * parseInt(item.price);
        }
      }

      const resPay = await axios.post(
        config.apiPath + "/api/reportProfit/payBetween",
        payload
      );
      if (resPay.data.results !== undefined) {
        payRecords = resPay.data.results;

        totalPay = 0;

        for (let i = 0; i < payRecords.length; i++) {
          let item = payRecords[i];
          totalPay += parseInt(item.qty) * parseInt(item.price);
        }
      }

      totalProfit = totalIncome - totalPay;
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
  <div class="card-header">Profit report</div>
  <div class="card-body">
    <div class="alert alert-dark">
      <div class="row">
        <div class="col-4">
          <div>วันที่เริ่ม</div>
          <input class="form-control" type="date" bind:value={fromDate} />
        </div>
        <div class="col-4">
          <div>วันที่สิ้นสุด</div>
          <input class="form-control" type="date" bind:value={toDate} />
        </div>
        <div class="col-4">
          <br />
          <button class="btn btn-dark" on:click={() => handleSelect()}
            ><i class="fa fa-search mr-2"></i>แสดงรายการ</button
          >
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <div class="card bg-success">
          <div class="card-body">
            <div class="h3 text-end">
              {totalIncome.toLocaleString("th-TH") + " THB"}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header bg-success">
            <i class="fa fa-plus mr-2"></i>รายได้
          </div>
          <div class="card-body">
            <strong>ค่าสมาชิก</strong>
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>ยอดรวม</th>
                </tr>
              </thead>
              <tbody>
                {#each incomeMemberShips as item}
                  <tr>
                    <td>{item.Member.name}</td>
                    <td class="text-end"
                      >{item.money.toLocaleString("th-TH")}</td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
            <br />
            <strong>ค่าคอร์ส</strong>
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>คอร์ส</th>
                  <th>ผู้เรียน</th>
                  <th>ราคา</th>
                  <th>จำนวน</th>
                  <th>ยอดเงิน</th>
                </tr>
              </thead>
              <tbody>
                {#each incomeCourseAndMember as item}
                  <tr>
                    <td>{item.Course.name}</td>
                    <td>{item.Member.name}</td>
                    <td>{item.price.toLocaleString("th-TH")}</td>
                    <td>{item.qty}</td>
                    <td class="text-end"
                      >{(item.qty * item.price).toLocaleString("th-TH")}</td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card bg-danger">
          <div class="card-body">
            <div class="h3 text-end">
              {totalPay.toLocaleString("th-TH") + " THB"}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header bg-danger">
            <i class="fa fa-minus mr-2"></i>รายจ่าย
          </div>
          <div class="card-body">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>รายการ</th>
                  <th>ราคา</th>
                  <th>จำนวน</th>
                  <th>ยอดรวม</th>
                </tr>
              </thead>
              <tbody>
                {#each payRecords as item}
                  <tr>
                    <td>{item.name}</td>
                    <td class="text-end"
                      >{item.price.toLocaleString("th-TH")}</td
                    >
                    <td class="text-end">{item.qty}</td>
                    <td class="text-end"
                      >{(item.qty * item.price).toLocaleString("th-TH")}</td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card bg-primary">
          <div class="card-body">
            <div class="h3 text-end">
              {#if totalProfit > 0}
                {"กำไร " + totalProfit.toLocaleString("th-TH") + " THB"}
              {:else if totalProfit < 0}
                {"ขาดทุน " + totalProfit.toLocaleString("th-TH") + " THB"}
              {:else}
                {"0 THB"}
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
