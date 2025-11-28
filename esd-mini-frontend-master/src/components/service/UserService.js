import axios from "axios";

class UserService {
    static BASE_URL = "http://localhost:8081";

    /** Utility: Returns headers with token */
    static authHeaders(token) {
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    }

    /** LOGIN */
    static async login(email, password) {
        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/api/auth/signin`,
                { email, password }
            );

            const data = response.data || {};

            // Normalize token key
            if (!data.token && data.accessToken) data.token = data.accessToken;

            return data;
        } catch (err) {
            throw err;
        }
    }

    /** GET CURRENT USER (/me) */
    static async getCurrentUser(token) {
        try {
            const response = await axios.get(
                `${UserService.BASE_URL}/api/employees/me`,
                UserService.authHeaders(token)
            );
            return response.data;
        } catch (err) {
            console.error("Error fetching current user:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    /** GET ALL USERS */
    static async getAllUsers(token) {
        try {
            const response = await axios.get(
                `${UserService.BASE_URL}/api/employees/all`,
                UserService.authHeaders(token)
            );
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /** GET USER BY ID */
    static async getUserById(employeeId, token) {
        try {
            const response = await axios.get(
                `${UserService.BASE_URL}/api/employees/${employeeId}`,
                UserService.authHeaders(token)
            );
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /** UPDATE USER */
    static async updateUser(employeeId, userData, token) {
        try {
            const response = await axios.put(
                `${UserService.BASE_URL}/api/employees/${employeeId}`,
                userData,
                UserService.authHeaders(token)
            );
            return response.data;
        } catch (err) {
            console.error("Error updating user:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    /** GET COURSES OF EMPLOYEE */
    static async getCoursesByEmployeeId(employeeId, token) {
        try {
            const response = await axios.get(
                `${UserService.BASE_URL}/api/employees/${employeeId}/courses`,
                UserService.authHeaders(token)
            );
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /** GET ALL COURSES (AUTH REQUIRED) */
    static async getAllCourses(token) {
        try {
            const response = await axios.get(
                `${UserService.BASE_URL}/api/employees/auth/courses`,
                UserService.authHeaders(token)
            );
            return response.data;
        } catch (err) {
            console.error("Error fetching courses:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    /** ASSIGN COURSE TO EMPLOYEE */
    static async assignCourse(employeeId, courseCode, token) {
        try {
            const response = await axios.put(
                `${UserService.BASE_URL}/api/employees/auth/${employeeId}/course`,
                { courseCode: courseCode },
                UserService.authHeaders(token)
            );
            return response.data;
        } catch (err) {
            console.error("Error assigning course:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    /** AUTH HELPERS */
    static logout() {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("storage"));
    }

    static isAuthenticated() {
        const token = localStorage.getItem("token");
        return !!token;
    }
}

export default UserService;
