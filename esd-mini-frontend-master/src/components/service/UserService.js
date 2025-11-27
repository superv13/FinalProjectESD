import axios from "axios";

class UserService{
    static BASE_URL = "http://localhost:8081"
    static async login(email,password){
        try{
            // Backend signin endpoint is POST /api/auth/signin
            const response = await axios.post(`${UserService.BASE_URL}/api/auth/signin`, { email, password });
            // Normalize token keys: backend may return 'token' or 'accessToken'
            const data = response.data || {};
            if (!data.token && data.accessToken) data.token = data.accessToken;
            return data;
        } catch(err){
            throw err;
        }
    }

    static async getAllUsers(token){
        try{
            // Backend: GET /api/employees/all
            const response = await axios.get(`${UserService.BASE_URL}/api/employees/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUserById(employeeId, token){
        try{
            // Backend: GET /api/employees/{id}
            const response = await axios.get(`${UserService.BASE_URL}/api/employees/${employeeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async updateUser(employeeId, userData, token){
        try{
            // Backend: PUT /api/employees/{id}
            const response = await axios.put(`${UserService.BASE_URL}/api/employees/${employeeId}`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }catch(err){
            console.error('Error:', err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static async getCoursesByEmployeeId(employeeId, token) {
        try {
            // Backend: GET /api/employees/{employeeId}/courses
            const response = await axios.get(`${UserService.BASE_URL}/api/employees/${employeeId}/courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getAllCourses(token) {
        try {
            // Backend: GET /api/employees/auth/courses
            const response = await axios.get(`${UserService.BASE_URL}/api/employees/auth/courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;  // response should contain CourseReqRes
        } catch (err) {
            console.error('Error fetching courses:', err.response ? err.response.data : err.message);
            throw err;
        }
    }
    

    /**AUTHENTICATION CHECKER */
    static logout(){
        localStorage.removeItem('token')
        window.dispatchEvent(new Event('storage'));
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }
}

export default UserService;