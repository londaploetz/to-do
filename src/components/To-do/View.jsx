import React from 'react'

const View = ({jobs, deleteJob}) => {

    return jobs.map(job=>(
        <tr key= {job.id} >
        <td>{job.task}</td>
        <td className='delete-btn' onClick= {()=>deleteJob(job.id)}> 
        </td>
        </tr>  
    ))
}


export default View