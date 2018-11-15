import React, { Component } from 'react'

class NavSearch extends Component {

    showList() {
        let listFilter = document.getElementsByTagName('aside');
        if(listFilter[0]) {
            listFilter[0].classList.add('open')
        }

    }

    render() {
        const { handleQuery } = this.props;
        return (
            <nav className="navbar">
                <div className="navbar-header">
                    <h1 tabIndex="0" className="site-name">Neighbour Location</h1>
                    <div className="flex-grow-1"></div>
                    <div className="navbar-form navbar-left" role="search">
                        <div className="form-group">
                            <input
                                aria-label="Input filter places:"
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Filter Available Places"
                                onChange={(event) => handleQuery(event.target.value)}
                                onFocus={() => this.showList()}
                                />
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

export default NavSearch;
