import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    picture: "",
    age: "",
    weight: "",
    bodyFat: "",
    leanMass: ""
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        name: user.name,
        email: user.email,
        picture: user.picture,
        age: "",
        weight: "",
        bodyFat: "",
        leanMass: ""
      });
      setPreviewImage(user.picture);
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle selecting a preset avatar
  const handlePresetImage = (imageUrl) => {
    setPreviewImage(imageUrl);
    setFormData({ ...formData, picture: imageUrl });
  };

  // Calculate lean muscle mass (Lean Mass = Weight - (Weight * Body Fat %))
  useEffect(() => {
    if (formData.weight && formData.bodyFat) {
      const leanMass = formData.weight - (formData.weight * (formData.bodyFat / 100));
      setFormData((prev) => ({ ...prev, leanMass: leanMass.toFixed(2) }));
    }
  }, [formData.weight, formData.bodyFat]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated user info:", formData);
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Edit Your Profile</h2>

        {/* Profile Picture Preview */}
        <div className="profile-picture-container">
          <img src={previewImage} alt="Profile" className="profile-picture" />
        </div>

        {/* Upload Image */}
        <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />

        {/* Preset Avatars */}
        <div className="preset-images">
          <img src="https://i.pravatar.cc/100?img=1" onClick={() => handlePresetImage("https://i.pravatar.cc/100?img=1")} alt="Avatar1" />
          <img src="https://i.pravatar.cc/100?img=2" onClick={() => handlePresetImage("https://i.pravatar.cc/100?img=2")} alt="Avatar2" />
          <img src="https://i.pravatar.cc/100?img=3" onClick={() => handlePresetImage("https://i.pravatar.cc/100?img=3")} alt="Avatar3" />
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" required />
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" required />
          <input type="number" name="bodyFat" value={formData.bodyFat} onChange={handleChange} placeholder="Body Fat (%)" required />
          <input type="text" name="leanMass" value={formData.leanMass} readOnly placeholder="Lean Muscle Mass (kg)" />

          <button type="submit" className="btn save-btn">Save Changes</button>
        </form>

        {/* Logout Button */}
        <button onClick={() => logout({ returnTo: window.location.origin })} className="btn logout-btn">Log Out</button>
      </div>
    </div>
  );
};

export default Profile;
