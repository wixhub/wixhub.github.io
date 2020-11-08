// Page print
function pagePrint() {
    var display_setting = "toolbar=no,location=no,directories=no,menubar=no,";
    display_setting += "scrollbars=no,width=750,height=500,left=100,top=100";

    var main_content_innerhtml = document.getElementById("main-content").innerHTML;
    var footer_content_innerhtml = document.getElementById("footer-content").innerHTML;
    
    var document_print = window.open("","",display_setting);
    var document_print = "";
    document_print.document.open();
    document_print.document.write('<html><head><title>Jana Semenova Lebenslauf</title></head>');
    document_print.document.write('<body style="font-family:verdana; font-size:12px;" onLoad="self.print();self.close();" >');
    document_print.document.write('<div><h1>Jana Semenova</h1>');
    document_print.document.write('<p>E-Mail: jana.semenova@gmx.de</p>');
    document_print.document.write('<p>Skype: yanasemenova</p>');
    document_print.document.write('</div>');
    document_print.document.write('<hr>');
    document_print.document.write(main_content_innerhtml);
    document_print.document.write('<hr>');
    document_print.document.write(footer_content_innerhtml);
    document_print.document.write('</body></html>');
    document_print.print();
    document_print.document.close();
    return false;
}