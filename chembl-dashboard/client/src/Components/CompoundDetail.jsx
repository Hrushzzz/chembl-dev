import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import OCL from "openchemlib/full";

// Function to rendering 2D molecular structure
const renderMolecule = (smiles) => {
  if (!smiles) return "Structure not available";
  const molecule = OCL.Molecule.fromSmiles(smiles);
  return molecule.toSVG(300, 300); // Rendering as SVG
};

const CompoundDetail = () => {
  const { chemblId } = useParams();
  const [compound, setCompound] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompoundDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/compound/details/${chemblId}`);
        setCompound(response.data);
      } catch (error) {
        console.error("Error fetching compound details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompoundDetails();
  }, [chemblId]);

  if (loading) return <CircularProgress sx={{ margin: "20px auto", display: "block" }} />;
  if (!compound) return <Typography variant="h6">Compound not found</Typography>;

  return (
    <Card sx={{ maxWidth: 600, margin: "20px auto", padding: "20px", textAlign: "center" }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Compound Details</Typography>
        <Typography variant="body1"><b>ChEMBL ID:</b> {compound.chembl_id}</Typography>
        <Typography variant="body1"><b>Name:</b> {compound.pref_name || "N/A"}</Typography>
        <Typography variant="body1"><b>Molecule Type:</b> {compound.molecule_type}</Typography>
        <Typography variant="body1"><b>Max Phase:</b> {compound.max_phase}</Typography>
        <Typography variant="body1"><b>First Approval:</b> {compound.first_approval || "N/A"}</Typography>

        {/* 2D Structure Viewer */}
        <div dangerouslySetInnerHTML={{ __html: renderMolecule(compound.canonical_smiles) }} />

        <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 2 }}>Molecular Properties</Typography>
        <Typography variant="body2"><b>MW:</b> {compound.full_mwt}</Typography>
        <Typography variant="body2"><b>LogP:</b> {compound.alogp}</Typography>
        <Typography variant="body2"><b>HBD:</b> {compound.hbd}</Typography>
        <Typography variant="body2"><b>HBA:</b> {compound.hba}</Typography>
        <Typography variant="body2"><b>PSA:</b> {compound.psa}</Typography>
        <Typography variant="body2"><b>Rotatable Bonds:</b> {compound.rtb}</Typography>
      </CardContent>
    </Card>
  );
};

export default CompoundDetail;
