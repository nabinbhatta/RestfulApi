const express = require('express');
const app = express();




app.use(express.json());

const courses =[
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
]

app.get('/',(req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req,res) =>{
    res.send([1, 2, 3]);
});

app.post('/api/courses', (req, res) => {
 /*   const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    console.log(result);

    if (!req.body.name || req.body.name.length <3) {
        //400 bad request
        res.status(400).send('Name is required nd should be less than 3');
        return;
    }
    */
    const result = Joi.validateCourse(req.body);
    const { error} = validateCourse(req.body); 
    if (error) res.status(400).send(result.error.details[0].message);

    const course = {
        id: courses.length+1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    //Look up the course
    //If no existing, return 404
    const  course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not available.');

    //Validate
    //If invalid, return 400 -Bad request
   /* const schema = {
        name: Joi.string().min(3).required()
    };
    */
    const result = Joi.validateCourse(req.body);
    const { error} = validateCourse(req.body); 
    if (error) return res.status(400).send(result.error.details[0].message);

    //Update course
    course.name = req.body.name;
    //Return the updated course
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    //Look up the course
    //Not existing, return 404
    const  course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not available.');

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    //Return the same course
    res.send(course);
});
function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
};

return Joi.validate(course, schema);
}
app.get('/api/courses/:id', (req,res) => {
    const  course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not available.');
    res.send(course);
});
app.listen(3000, () => console.log('Listening on port 3000...'));