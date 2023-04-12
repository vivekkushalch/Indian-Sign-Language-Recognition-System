$("#myElement1").downupPopup();
$("#myElement1").downupPopup({
    duration: "300", // milliseconds
    animation: "ease", // css effects -> ease, linear, ease-in, ease-out, ease-in-out, cubic-bezier(n,n,n,n)
    background: true, // true, false -> dark background
    radiusLeft: "10px", // top-left-radius
    radiusRight: "10px", // top-right-radius
    distance: 20, // distance top
    headerText: "", // title, you can use HTML here -> <b>Example</b>
    width: "100%", // width -> 100%, 80%, 200px etc.
    contentScroll: false // true, false -> for use, <div class="downupPopup-content"></div> have to inside the element
});
$("#btn-1").click(function() {
    $("#myElement1").css('display:block;')
    $("#myElement1").downupPopup("open");
});