import {Injectable} from '@angular/core';

@Injectable()
export class TableToCsv {
    
    constructor() {
        
    }
    make(table, fileName) {
        let blob = exportTableToCSV($(table), fileName);
        let a = document.createElement("a");
        document.body.appendChild(a);
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}

function exportTableToCSV($table, filename) {
    let $headers = $table.find('tr:has(th)')
        ,$rows = $table.find('tr:has(td)')
        ,tmpColDelim = String.fromCharCode(11) // vertical tab character
        ,tmpRowDelim = String.fromCharCode(0) // null character
        ,colDelim = '","'
        ,rowDelim = '"\r\n"';

    let csv = '"';
    csv += formatRows($headers.map(grabRow));
    csv += rowDelim;
    csv += formatRows($rows.map(grabRow)) + '"';

    let csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    let blob = new Blob([decodeURIComponent(encodeURI(csv))], {
        type: "text/csv;charset=utf-8;",
    });
    return blob;

    function formatRows(rows){
        return rows.get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim);
    }
    function grabRow(i, row){

        let $row = $(row);
        let $cols = $row.find('td');
        if(!$cols.length) $cols = $row.find('th');
        return $cols.map(grabCol).get().join(tmpColDelim);
    }
    function grabCol(j, col){
        let $col = $(col), $text = $col.text();
        return $.trim($text.replace('"', '""'));
    }
}
