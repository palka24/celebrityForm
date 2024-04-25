import React from 'react'

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {

    const pageNumbers = [...Array(nPages + 1).keys()].slice(1)

    

    const goToNextPage = () => {
            if(currentPage !== nPages) setCurrentPage(currentPage + 1)
    }
    const goToPrevPage = () => {
        if(currentPage !== 1) setCurrentPage(currentPage - 1)
    }
    return (
        <nav>
            <ul className='pagination justify-content-center paginationStyle'>
                <li className="page-item paginationStyle">
                    <a className="page-link paginationStyle" 
                        onClick={goToPrevPage} 
                        href='#'>
                        
                        Previous
                    </a>
                </li>
                {pageNumbers.map(pgNumber => (
                    <li key={pgNumber} 
                        className= {`paginationStyle page-item ${currentPage == pgNumber ? 'active' : ''} `} >

                        <a onClick={() => setCurrentPage(pgNumber)}  
                            className='page-link paginationStyle' 
                            href='#'>
                            
                            {pgNumber}
                        </a>
                    </li>
                ))}
                <li className="page-item paginationStyle">
                    <a className="page-link paginationStyle" 
                        onClick={goToNextPage}
                        href='#'>
                        
                        Next
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination