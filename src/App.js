import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <Router>
        <Navbar/>
        <Header/>
        <RouterPaths/>
    </Router>
  );
}

function Navbar() {
  return (
  <nav className="navbar navbar-expand navbar-dark navbg-dark">
    <a className="navbar-brand" href="/">Stock Blast</a>
      <NavbarLinks/>
  </nav>
  );
}

const NavbarLinks = () => (
  <ul className="navbar-nav mr-auto">
    <li className="nav-item">
      <a className={CheckActive("/")} href="/">Home</a>
    </li>
    <li className="nav-item">
      <a className={CheckActive("/all")} href="/all">Stocks</a>
    </li>
    <li className="nav-item" style={
      window.location.pathname.includes("/history") ? {display: ""} : {display: "none"}
      }>
      <span className="nav-link active">History</span>
    </li>
  </ul>
);

function CheckActive(link) {
  if (window.location.pathname === link)
    return "nav-link active";
  else
    return "nav-link";
}

function Header() {
  return (
    <div className="container bg rounded mt-4">
      <div className="row">
        <div className="col-1"/>
        <div className="home col-10 mt-3 mb-3">
          <h1>Stock Blast</h1>
          <h5>The Revolutionary Stock Market App </h5>
        </div>
        <div className="col-1"/>
      </div>
    </div>
  );
}

const RouterPaths = () => (
  <main>
    <Route exact path="/" component={Home}/>
    <Route exact path="/all" component={StockListingsPage}/>
    <Route exact path="/history" component={HistoryPage}/>
  </main>
);

const Home = () => (
  <div className="container bg rounded">
    <div className="row mt-4">
      <div className="col-1"/>
      <div className="home col-10 mt-3">
        <p>
          <b>This application will show you all stocks,
            including the last 100 days of activity.</b>
        </p>
        <p>
          <b>Use the navbar, or
            <a href="/all" className="link"> click here </a> 
            to jump right into the action!</b>
        </p>
        <img src="https://cdn.pixabay.com/photo/2018/02/14/17/49/line-graph-3153441_960_720.png"
        width="60%" alt="Stocks Line Graph"/>
      </div>
      <div className="col-1"/>
    </div>
  </div>
);

const StockListingsPage = () => {
  const [gridApi, setGridApi] = useState();
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [symbolFilter, setSymbolFilter] = useState();
  const [nameFilter, setNameFilter] = useState();
  const [industryFilter, setIndustryFilter] = useState();

  useEffect(() => {
    if (gridApi) {
      setSymbolFilter(gridApi.getFilterInstance('symbol'));
      setNameFilter(gridApi.getFilterInstance('name'));
      setIndustryFilter(gridApi.getFilterInstance('industry'));
    }
  }, [gridApi]);

  useEffect(() => { // Apply filter whenever the symbol, name or industry search are filled
    if (symbol && symbolFilter) { // If symbol filter is active
      symbolFilter.setModel({type: "contains", filter: symbol});
      nameFilter.setModel({type: "contains", filter: ""});
      industryFilter.setModel({type: "contains", filter: ""});
    } else if (name && nameFilter) { // If name filter is active
      nameFilter.setModel({type: "contains", filter: name});
      symbolFilter.setModel({type: "contains", filter: ""});
      industryFilter.setModel({type: "contains", filter: ""});
    } else if (industry && industryFilter) { // If industry filter is active
      industryFilter.setModel({type: "contains", filter: industry});
      symbolFilter.setModel({type: "contains", filter: ""});
      nameFilter.setModel({type: "contains", filter: ""});
    } else if (symbolFilter && industryFilter && nameFilter) { // If filter fields are empty
      symbolFilter.setModel({type: "contains", filter: ""});
      nameFilter.setModel({type: "contains", filter: ""});
      industryFilter.setModel({type: "contains", filter: ""});
    }
    if (gridApi) {
      gridApi.onFilterChanged();
    }
  }, [symbol, name, industry, symbolFilter, nameFilter, industryFilter, gridApi]);

  return (
  <div className="container bg rounded mt-4">
    <div className="row justify-content-center">
      <div className="col-6 mt-2 mb-3">
        <h2>Stock Listings</h2>
        <GetStocks setGridApi={setGridApi}/>
        <div className="row mt-3 mb-1 ml-1 mr-2 border-bottom">
            Filters
        </div>
        <div className="row">
          <div className="col-2 pr-2 pl-0 ml-3">
            {/* Adding symbol filter input field */}
            <SymbolSearch symbol={symbol} setSymbol={setSymbol} setName={setName} setIndustry={setIndustry} 
              symbolFilter={symbolFilter} industryFilter={industryFilter} gridApi={gridApi}/>
          </div>
          <div className="col-5">
            {/* Adding symbol filter input field */}
            <NameSearch name={name} setName={setName} setSymbol={setSymbol} setIndustry={setIndustry} 
              symbolFilter={symbolFilter} industryFilter={industryFilter} gridApi={gridApi}/>
          </div>
          <div className="col-4 ml-3 pr-1">
            {/* Adding industry filter input field */}
            <IndustrySearch industry={industry} setIndustry={setIndustry} setName={setName} setSymbol={setSymbol} 
              industryFilter={industryFilter} symbolFilter={symbolFilter} gridApi={gridApi}/>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

const SymbolSearch = ({symbol, setSymbol, setName, setIndustry}) => {
  return (
    <input className="form-control" type="text" maxLength="4"
      placeholder="Symbol" style={{textTransform: "uppercase"}}
      value={symbol} onChange={event => {
        UpdateURL("?symbol="+event.target.value.toLowerCase());
        setSymbol(event.target.value.toLowerCase());
        setName("");
        setIndustry("");
      }}
    />
  );
}

const NameSearch = ({name, setName, setSymbol, setIndustry}) => {
  return (
    <input className="form-control" type="text"
      placeholder="Name"
      value={name} onChange={event => {
        UpdateURL("?name="+event.target.value.toLowerCase());
        setName(event.target.value.toLowerCase());
        setSymbol("");
        setIndustry("");
      }}
    />
  );
}

const IndustrySearch = ({industry, setIndustry, setSymbol, setName}) => {
  return (
    <input className="form-control" type="text"
      placeholder="Industry" value={industry} onChange={event => {
        UpdateURL("?industry="+event.target.value);
        setIndustry(event.target.value);
        setSymbol("");
        setName("");
      }}
    />
  );
}

function UpdateURL(query)
{
  let url = window.location.href;
  if (url.includes('?')) {
    url = url.substring(0, url.indexOf('?'));
  }
  if (query.substring(query.indexOf('=')).length === 1)
  {
    query="";
  }
  window.history.pushState({index: query}, "", url+query);
}

function GetStocks({setGridApi}) {
  const [rowData, setRowData] = useState([]);

  const columns = [
    { 
      headerName: "Symbol", 
      field: "symbol",
      width: 100,
      sortable: true
    },
    {
      headerName: "Name",
      field: "name",
      width: 250,
      sortable: true,
      filter: true
    },
    {
      headerName: "Industry",
      field: "industry",
      width: 180,
      sortable: true
    }
  ];
  
  useEffect(() => {
    fetch("http://131.181.190.87:3001/all")
      .then(res => {
        // Error checking Block
        if (!res.ok)
        {
          return res.json()
          .catch(() => {
            throw new Error(res.status);
          })
          .then(({message}) => {
            throw new Error(message || res.status);
          })
        }
        // End error checking Block
        return res.json();
      })
      .then(data =>
        data.map(stock => {
          return ({
            symbol: stock.symbol,
            name: stock.name,
            industry: stock.industry
          });
        })
      )
      .then(stocks => setRowData(stocks));
  }, []);

  return (
    <div
      className="ag-theme-balham"
      style={{
        height: "347px",
        width: "532px"
      }}
    >
      <AgGridReact
        columnDefs={columns}
        rowData={rowData}
        pagination={true}
        paginationPageSize={10}
        rowSelection={"single"}
        suppressCellSelection={true}
        onGridReady={params => setGridApi(params.api)}
        onRowClicked={event => {
          let url = window.location.origin;
          window.location.href = url+"/history?symbol="+event.data.symbol.toLowerCase()
        }}
      />
    </div>
  );
}

const HistoryPage = () => {
  const [stockName, setStockName] = useState("");
  const [rowData, setRowData] = useState([]);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [dates, setDates] = useState(["No filter"]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [closeData, setCloseData] = useState([]);

  let chartData = {
    data: {
      labels: dates.slice(1),
      datasets: [ {
        label: "Closing Prices",
        data: closeData
      }]
    }
  }
  
  // Manual data filtering by indicies
  useEffect(() => {
    if (selectedDate === "0" || selectedDate === 0) {
      setFilteredRowData(rowData);
    } else if (selectedDate > 0) {
      setFilteredRowData(rowData.slice(0, selectedDate));
    }
  }, [selectedDate, rowData]);

  const filterDate = (event) => {
    setSelectedDate(event.target.value);
  }
  
  return (
    <div className="container bg rounded mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-5 mt-2 mb-3">
          <h4><b>{stockName}</b> Stock History</h4>
          <GetStockHistory setStockName={setStockName} filteredRowData={filteredRowData} 
            setRowData={setRowData} setDates={setDates} setCloseData={setCloseData}
          />
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-5">
          <label>Filter date from</label>
          <select className="form-control mb-3 col-5" value={selectedDate} onChange={filterDate}>
            {/* Mapping the dates state array to the select options */}
            {dates.map((x,y) => <option key={y} value={y}>{x}</option>)}
          </select>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-6 mb-4">
          <Line data={chartData.data}></Line>
        </div>
      </div>
    </div>
  )};

  function GetStockHistory({setStockName, filteredRowData, setRowData, setDates, setCloseData}) {
    const columns = [
      { 
        headerName: "Date", 
        field: "date",
        width: 90,
        sortable: true
      },
      {
        headerName: "Open",
        field: "open",
        width: 60,
        sortable: true,
        type: "rightAligned"
      },
      {
        headerName: "High",
        field: "high",
        width: 60,
        sortable: true,
        type: "rightAligned"
      },
      {
        headerName: "Low",
        field: "low",
        width: 60,
        sortable: true,
        type: "rightAligned"
      },
      {
        headerName: "Close",
        field: "close",
        width: 60,
        sortable: true,
        type: "rightAligned"
      },
      {
        headerName: "Volumes",
        field: "volumes",
        width: 90,
        sortable: true,
        type: "rightAligned"
      }
    ];
    
    useEffect(() => {
      fetch("http://131.181.190.87:3001/history"+window.location.search)
        .then(res => {
          // Error checking Block
          if (!res.ok)
          {
            return res.json()
            .catch(() => {
              throw new Error(res.status);
            })
            .then(({message}) => {
              throw new Error(message || res.status);
            })
          }
          // End error checking Block
          return res.json();
        })
        .then(data => {
          setStockName(data[0].name)
          return data;
        })
        .then(data =>
          data.map(stock => {
            let newDate = stock.timestamp.substring(0,10)
            .replace(/-/g, '/') // Regex "replaceAll" to format date with / instead of -
            .split("/").reverse().join("/"); // Split, Reverse, Join required to reverse date format
            setDates(prevDates => [...prevDates, newDate])
            setCloseData(prevCloses => [...prevCloses, stock.close]);
            return ({
              date: newDate, 
              open: stock.open.toFixed(2),
              high: stock.high.toFixed(2),
              low: stock.low.toFixed(2),
              close: stock.close.toFixed(2),
              volumes: stock.volumes.toLocaleString("en")
            });
          })
        )
        .then(stocks => setRowData(stocks));
    }, [setStockName, setRowData, setDates, setCloseData]);
  
    return (
      <div
        className="ag-theme-balham"
        style={{
          height: "347px",
          width: "422px"
        }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={filteredRowData}
          pagination={true}
          paginationPageSize={10}
          rowSelection={"multiple"}
          rowMultiSelectWithClick={true}
          suppressCellSelection={true}
        />
      </div>
    );
  }