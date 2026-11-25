// ใส่ Web App URL จาก Google Apps Script ในตัวแปรนี้ก่อนใช้งานจริง
const API_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const products = [
  {sku:"CHO001",name:"Dark Chocolate 70%",desc:"ดาร์กช็อกโกแลตเข้มข้น 70% รสโกโก้ชัดเจน หวานกำลังดี",price:89,image:"images/dark-chocolate.svg",tag:"INTENSE & ELEGANT"},
  {sku:"CHO002",name:"Milk Chocolate Almond",desc:"มิลค์ช็อกโกแลตเนื้อนุ่ม ผสานอัลมอนด์อบกรอบ",price:99,image:"images/milk-chocolate.svg",tag:"CREAMY & CRUNCHY"}
];
const cart = Object.fromEntries(products.map(p=>[p.sku,0]));
const money = n => new Intl.NumberFormat("th-TH",{style:"currency",currency:"THB",maximumFractionDigits:0}).format(n);
function renderProducts(){
  document.getElementById("product-list").innerHTML = products.map(p=>`
    <article class="product-card">
      <div class="product-image"><img src="${p.image}" alt="${p.name}"></div>
      <div class="product-info"><div class="product-meta"><span>${p.sku}</span><span>${p.tag}</span></div>
      <h3>${p.name}</h3><p>${p.desc}</p>
      <div class="product-bottom"><strong class="price">${money(p.price)}</strong>
      <div class="qty-control"><button type="button" aria-label="ลดจำนวน" onclick="changeQty('${p.sku}',-1)">−</button><span id="qty-${p.sku}">0</span><button type="button" aria-label="เพิ่มจำนวน" onclick="changeQty('${p.sku}',1)">+</button></div></div></div>
    </article>`).join("");
}
function changeQty(sku,delta){cart[sku]=Math.max(0,cart[sku]+delta);document.getElementById(`qty-${sku}`).textContent=cart[sku];updateTotal();}
function updateTotal(){const count=Object.values(cart).reduce((a,b)=>a+b,0);const total=products.reduce((sum,p)=>sum+p.price*cart[p.sku],0);document.getElementById("cart-count").textContent=count;document.getElementById("total").textContent=money(total);}
document.getElementById("checkout-form").addEventListener("submit",async e=>{
  e.preventDefault();
  const message=document.getElementById("form-message"),button=document.getElementById("submit-btn");
  const items=products.filter(p=>cart[p.sku]>0).map(p=>({sku:p.sku,name:p.name,price:p.price,quantity:cart[p.sku]}));
  if(!items.length){message.textContent="กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้นก่อนยืนยันคำสั่งซื้อ";return;}
  const form=Object.fromEntries(new FormData(e.currentTarget).entries());
  const payload={...form,items};
  if(API_URL.includes("PASTE_YOUR")){message.textContent="เว็บไซต์ตัวอย่างยังไม่ได้เชื่อม Google Sheets กรุณาตั้งค่า API_URL ตามคู่มือ README ก่อน";return;}
  button.disabled=true;button.textContent="กำลังบันทึกคำสั่งซื้อ...";
  try{
    const response=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});
    const result=await response.json();
    if(!result.success)throw new Error(result.message||"บันทึกไม่สำเร็จ");
    message.textContent=`สั่งซื้อสำเร็จ! เลขที่คำสั่งซื้อ ${result.orderId} ยอดรวม ${money(result.total)} เราจะจัดเตรียมสินค้าให้ค่ะ`;
    e.currentTarget.reset();products.forEach(p=>{cart[p.sku]=0;document.getElementById(`qty-${p.sku}`).textContent="0";});updateTotal();
  }catch(err){message.textContent="เกิดข้อผิดพลาด: "+err.message+" กรุณาลองใหม่อีกครั้ง";}
  finally{button.disabled=false;button.innerHTML='ยืนยันคำสั่งซื้อ <span>↗</span>';}
});
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();updateTotal();
