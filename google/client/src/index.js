import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import './index.css'
const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);
function Container({ fluid, children }) {
    return <div className={`container${fluid ? "-fluid" : ""}`}>{children}</div>;
}
function Row({ fluid, children }) {
    return <div className={`row${fluid ? "-fluid" : ""}`}>{children}</div>;
}
function Col({ size, children }) {
    return (
      <div
        className={size
          .split(" ")
          .map(size => "col-" + size)
          .join(" ")}
      >
        {children}
      </div>
    );
}
const SearchForm = props => {
    return (
        <form>
            <div className="form-group" style={{marginTop: "50px"}}>
                <label className="BookSearchLabel"><h3>(React) Google Books Search</h3></label>
                <br></br>
                <label className="BookSearchLabel"><h5>Search For and Save Books of Interest</h5></label>
                <br></br>
                <input className="col-12 form-control"
                    value={props.search}
                    type="text"
                    name="searchBook"
                    placeholder="Enter Book's Name"
                    onChange={props.handleInputChange}
                />
            </div>
            <button type="submit" className="submitBtn btn btn-primary" onClick={props.handleFormSubmit}>
                Submit
            </button>
        </form>
    )
}
const SearchResult = props => {
    return (props.books.length === 0) ? (
        <div className="card">
            <div className="card-body player">
                <div className="article">
                    <h3>Search Results</h3>
                </div>
            </div>
        </div>
    ) : (
            <div className="card">
                <div className="card-body player">
                    <div className="article">
                        <h3>Search Results</h3>
                        {props.books.map(book => {
                            return (
                                <li className="search-list list-group-item">
                                    <Row className="SearchResult row" id={book.title + "Card"} key={book._id}>
                                        {/* col-3 show image of the book */}
                                        <Col size="2" className="bookImage">
                                            <img src={book.image} alt={book.title} />
                                        </Col>
                                        <Col size="1" className="emptyCol"/>
                                        {/* col-9 show information of the book */}
                                        <Col size="9" className="bookInfo">
                                            <Row>
                                                <h3 className="bookTitle">{book.title}</h3>
                                            </Row>
                                            <Row>
                                                <h4 className="bookAuthor">{book.author}</h4>
                                            </Row>
                                            <Row>
                                                <p className="bookDescription">{book.description}</p>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <br></br>
                                    <Row className="buttonDiv ">
                                        <button className="saveBook btn btn-primary" id={book.id} onClick={(event) => props.handleSavedButton(event)}>
                                            Save
                                        </button>
                                        <a href={book.link} target="_blank">
                                            <button className="viewBook btn btn-primary">
                                                View
                                        </button>
                                        </a>
                                    </Row>
                                </li>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
}
const SavedResult = props => {
    return (props.savedBooks.length === 0) ? (
        <div className="card">
            <div className="card-body player">
                <div className="article">
                    <h3>Books that You Saved</h3>
                </div>
            </div>
        </div>
    ):(
        <div className="card">
            <div className="card-body player">
                <div className="article">
                    <h3>Books that You Saved</h3>
                    {props.savedBooks.map(savedbook => {
                        return (
                            <li className="saved-list list-group-item">
                                <Row className="SearchResult" id={savedbook.title + "Card"} key={savedbook._id}>
                                    {/* col-3 show image of the book */}
                                    <Col size="2" className="bookImage">
                                        <img src={savedbook.image} alt={savedbook.title} />
                                    </Col>
                                    <Col size="1" className="emptyCol"/>
                                    {/* col-9 show information of the book */}
                                    <Col size="9" className="bookInfo">
                                        <Row>
                                            <h2 className="bookTitle">{savedbook.title}</h2>
                                        </Row>
                                        <Row>
                                            <h3 className="bookAuthor">{savedbook.authors}</h3>
                                        </Row>
                                        <Row>
                                            <p className="bookDescription">{savedbook.description}</p>
                                        </Row>
                                    </Col>
                                </Row>
                                <br></br>
                                <Row className="buttonDiv ">
                                    <button className="deleteBook btn btn-primary" id={savedbook._id} onClick={() => props.handleDeleteButton(savedbook._id)}>
                                        Delete
                                    </button>
                                    <a href={savedbook.link} target="_blank">
                                        <button className="viewBook btn btn-primary">
                                            View
                                        </button>
                                    </a>
                                </Row>
                            </li>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
function Nav() {
    return (
        <nav className="navbar navbar-expand-lg navbar-primary bg-info">
            <a className="navbar-brand" href="/">
                <h2 className="text-success">Google Book Search</h2>
            </a>
            <div className="d-flex justify-content-end">
                <ul className="navbar-nav">
                    <li className="nav-item" id="home">
                        <a className="nav-link" href="/"><button type="button" className="btn btn-primary text-white">Search</button></a>
                    </li>
                    <li className="nav-item" id="report">
                        <a className="nav-link" href="/saved"><button type="button" className="btn btn-primary text-white">Saved</button></a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
class SearchBooks extends Component {
    state = {
        search: "",
        books: [],
        error: "",
        message: ""
    };

    handleInputChange = event => {
        this.setState({ search: event.target.value })
    }

    handleFormSubmit = event => {
        event.preventDefault();
        axios.get("https://www.googleapis.com/books/v1/volumes?q=" + (this.state.search))
            .then(res => {
                if (res.data.items === "error") {
                    throw new Error(res.data.items);
                }
                else {
                    let results = res.data.items
                    results = results.map(result => {
                        result = {
                            key: result.id,
                            id: result.id,
                            title: result.volumeInfo.title,
                            author: result.volumeInfo.authors,
                            description: result.volumeInfo.description,
                            image: result.volumeInfo.imageLinks.thumbnail,
                            link: result.volumeInfo.infoLink
                        }
                        return result;
                    })
                    this.setState({ books: results, error: "" })
                }
            })
            .catch(err => this.setState({ error: err.items }));
    }

    handleSavedButton = event => {
        event.preventDefault();
        let savedBooks = this.state.books.filter(book => book.id === event.target.id)
        savedBooks = savedBooks[0];
        axios.post("/api/books", savedBooks)
            .then(this.setState({ message: alert("Your book is saved") }))
            .catch(err => console.log(err))
    }
    render() {
        return (
            <Container fluid>
                <Container>
                    <Row>
                        <Col size="12">
                            <SearchForm
                                handleFormSubmit={this.handleFormSubmit}
                                handleInputChange={this.handleInputChange}
                            />
                        </Col>
                    </Row>
                </Container>
                <br></br>
                <Container>
                    <SearchResult books={this.state.books} handleSavedButton={this.handleSavedButton} />
                </Container>
            </Container>
        )
    }

}
class SaveBook extends Component {
    state = {
        savedBooks: []
    };

    componentDidMount() {
        axios.get("/api/books")
            .then(res => this.setState({ savedBooks: res.data }))
            .catch(err => console.log(err))
    }

    handleDeleteButton = id => {
        axios.delete("/api/books/" + id)
            .then(res => this.componentDidMount())
            .catch(err => console.log(err))
    }

    render() {
        return (
            <Container fluid className="container">
                <Container>
                    <SavedResult savedBooks={this.state.savedBooks} handleDeleteButton={this.handleDeleteButton} />
                </Container>
            </Container>
        )
    }
}

function App() {
    return (
    <Router>
        <div>
            <Nav/>
            <Switch>
                <Route exact path="/" component={SearchBooks} />
                <Route exact path="/saved" component={SaveBook} />
                <Route exact path="/saved/:id" component={SaveBook} />
            </Switch>
        </div>
    </Router>
);
}

function registerServiceWorker() {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
        if (publicUrl.origin !== window.location.origin) {
            return;
        }

        window.addEventListener("load", () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (!isLocalhost) {
                navigator.serviceWorker
                    .register(swUrl)
                    .then(registration => {
                        registration.onupdatefound = () => {
                            const installingWorker = registration.installing;
                            installingWorker.onstatechange = () => {
                                //Report error here for the content not found.
                            };
                        };
                    })
                    .catch(error => {
                        //Report error here
                    });
            } else {
                fetch(swUrl)
                    .then(response => {
                        if (
                            response.status === 404 ||
                            response.headers.get("content-type").indexOf("javascript") === -1
                        ) {
                            navigator.serviceWorker.ready.then(registration => {
                                registration.unregister().then(() => {
                                    window.location.reload();
                                });
                            });
                        } else {
                            navigator.serviceWorker
                                .register(swUrl)
                                .then(registration => {
                                    registration.onupdatefound = () => {
                                        //Report error based on the if else condition
                                    };
                                })
                                .catch(error => {
                                    //Report error here.
                                });
                        }
                    })
                    .catch(() => {
                        //Report error here.
                    });
            }
        });
    }
}


export function unregister() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
        });
    }
}
ReactDOM.render( < App / > , document.getElementById("root"));
registerServiceWorker();
